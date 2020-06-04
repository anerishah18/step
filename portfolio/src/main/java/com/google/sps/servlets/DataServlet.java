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

package com.google.sps.servlets;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.lang.String;
import com.google.gson.Gson;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.sps.data.Comment;

/** Servlet that returns some example content. TODO: modify this file to handle comments data */
@WebServlet("/data")
public class DataServlet extends HttpServlet {

    private List<String> comments;
    private String commentsJson;

    @Override
    public void init() {
        comments = new ArrayList<>();
        commentsJson = "{";
    }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    /*
    //Function returns all comments as json string
    String commentsJsonFinal = commentsJson + "}";
    response.setContentType("application/json;");
    response.getWriter().println(commentsJsonFinal);
    */

    //Function loads all comments from DataStore and displays them
    int maxComments = getMaxComments(request, "maxComments");
    Query query = new Query("Comment").addSort("timestamp", SortDirection.DESCENDING);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);

    int addedComments = 0;

    List<Comment> commentsList = new ArrayList<>();
    for (Entity entity : results.asIterable()) {
      if (maxComments > 0 && addedComments >= maxComments) {
          break;
      }
      long id = entity.getKey().getId();
      String title = (String) entity.getProperty("title");
      long timestamp = (long) entity.getProperty("timestamp");

      Comment comment = new Comment(id, title, timestamp);
      commentsList.add(comment);

      addedComments += 1;
    }

    Gson gson = new Gson();

    response.setContentType("application/json;");
    response.getWriter().println(gson.toJson(commentsList));
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
      String text = getParameter(request, "text-input", null);
      comments.add(text);
      appendCommentToJson(text);
      if (text != null && text.length() > 0) {
        addCommentToDataStore(text);
      }

      //response.setContentType("application/json;");
      //response.getWriter().println(commentsJson + "}");

      //response.sendRedirect("/data?maxComments="+maxComments);
      response.sendRedirect("/index.html");
  }

  //Function retrieves parameter from request.
  //Provides default value upon null retrieval
  private String getParameter(HttpServletRequest request, String name, String defaultValue) {
    String value = request.getParameter(name);
    if (value == null) {
      return defaultValue;
    }
    return value;
  }

  //Function adds a comment to running JSON string attribute of class
  private void appendCommentToJson(String comment) {
      int commentNum = comments.size();
      if (commentNum > 1) {
          commentsJson += ", ";
      }
      commentsJson += "Comment #" + commentNum + ":";
      commentsJson += "\"" + comment + "\"";
  }

  //Function adds comment to DataStore, specifying comment contents and timestamp
  private void addCommentToDataStore(String comment) {
      int commentNum = comments.size();
      long timestamp = System.currentTimeMillis();

      Entity taskEntity = new Entity("Comment");
      taskEntity.setProperty("title", comment);
      taskEntity.setProperty("timestamp", timestamp);

      DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
      datastore.put(taskEntity);
  }

  //Function retrieves number of comments user wishes to see from request
  //Returns -1 for non-integer or negative user inputs
  private int getMaxComments(HttpServletRequest request, String name) {
      String maxCommentsString = request.getParameter(name);

      int maxComments;

      try {
        maxComments = Integer.parseInt(maxCommentsString);
      } catch (NumberFormatException e) {
        System.err.println("Could not convert to int: " + maxCommentsString);
        return -1;
      }
      if (maxComments < 0) {
          System.err.println("negative int: " + maxComments);
          return -1;
      }

      System.out.println("maxComments: " + maxComments);

      return maxComments;
  }

  //Function used to convert hard-coded ArrayList to JSON string
  private String convertToJson(List<String> stats) {
    String json = "{";
    json += "\"Hometown\": ";
    json += "\"" + stats.get(0) + "\"";
    json += ", ";
    json += "\"University\": ";
    json += "\"" + stats.get(1) + "\"";
    json += ", ";
    json += "\"Major\": ";
    json += "\"" + stats.get(2) + "\"";
    json += "}";
    return json;
  }
}
