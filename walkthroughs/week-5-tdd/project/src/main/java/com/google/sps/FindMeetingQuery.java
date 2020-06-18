// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps;

import java.util.Collection;
import java.util.Collections;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.lang.Long;
import java.util.Set;
import java.util.HashSet;

public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    //throw new UnsupportedOperationException("TODO: Implement this method.");
    List<TimeRange> validTimes = new ArrayList<>();
    Long duration = request.getDuration();
    Collection<String> attendees = request.getAttendees();
    Collection<String> optionalAttendees = request.getOptionalAttendees();
    
    //special cases checking
    //if duration is longer than a day, return empty set of time ranges
    if (duration.compareTo(new Long(TimeRange.WHOLE_DAY.duration())) > 0) {
        return validTimes;
    }
    //if no attendees, any time in the day is possible
    if (attendees.isEmpty() && optionalAttendees.isEmpty()) {
        validTimes.add(TimeRange.WHOLE_DAY);
        return validTimes;
    }

    if (events.isEmpty()) {
        validTimes.add(TimeRange.WHOLE_DAY);
        return validTimes;
    }

    //check if options exist for optional and mandatory attendees
    Collection<String> allAttendees = new HashSet<String>();
    allAttendees.addAll(attendees);
    allAttendees.addAll(optionalAttendees);
    if (!optionalAttendees.isEmpty()) {
        MeetingRequest newRequest = new MeetingRequest(allAttendees, duration);
        Collection<TimeRange> allAttendeesOptions = query(events, newRequest);
        if (!allAttendeesOptions.isEmpty()) {
            return allAttendeesOptions;
        }
        if (attendees.isEmpty()) {
            return allAttendeesOptions;
        }
    }

    //normal cases
    //slots contains half-hour (between 8:30AM and 9PM) slots and the start-8:30AM and the 9PM-end slots
    List<TimeRange> slots = new ArrayList<>();
    //available contains 0 for the time slots that everyone is available for so far 
    //and 1 for the time slots at least one attendee is not available during 
    int[] available = new int[28];

    //populating slots
    int TIME_0800AM = TimeRange.getTimeInMinutes(8, 0);
    int TIME_0900PM = TimeRange.getTimeInMinutes(21, 0);

    slots.add(TimeRange.fromStartEnd(TimeRange.START_OF_DAY, TIME_0800AM, false));

    int timeCountInMinutes = 8 * 60;
    int count = 0;

    while (count < 26) {
        slots.add(TimeRange.fromStartEnd(timeCountInMinutes, timeCountInMinutes + 30, false));
        timeCountInMinutes += 30;
        count += 1;
    }

    slots.add(TimeRange.fromStartEnd(TIME_0900PM, TimeRange.END_OF_DAY + 1, false));

    boolean anyOverlap = false;
    for (Event event: events) {
        boolean attendeesOverlap = false;
        Set<String> eventAttendees = event.getAttendees();
        TimeRange eventTimeRange = event.getWhen();
        //check whether the event includes any attendees that are in the meeting request
        for (String attendee: eventAttendees) {
            if (attendees.contains(attendee)) {
                attendeesOverlap = true;
                anyOverlap = true;
                break;
            }
        }
        //if attendees overlap, mark "1" (busy) in available for the pertinent time slots
        if (attendeesOverlap) {
            for (int i = 0; i < slots.size(); i++) {
                if (eventTimeRange.overlaps(slots.get(i))) {
                    available[i] = 1;
                }
            }
        }
    }

    //if none of the attendees overlap with any of the events, then the whole day is available
    if (!anyOverlap) {
        validTimes.add(TimeRange.WHOLE_DAY);
        return validTimes;
    }


    //finds the first available starting slot, and stores the start time in currentStart
    int currentStart = TimeRange.START_OF_DAY;
    int firstAvailable = 0;
    if (available[0] != 0) {
        while (firstAvailable < available.length && available[firstAvailable] == 1) {
            currentStart = slots.get(firstAvailable).end();
            firstAvailable += 1;
        }

        if (firstAvailable > 0 && firstAvailable < available.length - 1) {
            currentStart = slots.get(firstAvailable).start();
        }
        else if (firstAvailable >= available.length) {
            return validTimes;
        }
        else {
            if (duration <= 30) {
                validTimes.add(slots.get(firstAvailable));
            }
            return validTimes;
        }
    }

    //uses the available array to explicitly construct available time ranges
    for (int i = firstAvailable; i < available.length; i++) {
        if (available[i] == 1) {
            if (currentStart != slots.get(i).start()) {
                if (duration <= slots.get(i).start() - currentStart) {
                    validTimes.add(TimeRange.fromStartEnd(currentStart, slots.get(i).start(), false));
                }
                currentStart = slots.get(i).end();
            }
            else {
                currentStart = slots.get(i).end();
            }
        }

        if (i == available.length - 1 && available[i] == 0) {
            validTimes.add(TimeRange.fromStartEnd(currentStart, slots.get(i).end(), false));
        }
    }

    return validTimes;
    
  }
}
