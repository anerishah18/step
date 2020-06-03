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
import com.google.gson.Gson;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;

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
    //Function returns all comments as json string
    String commentsJsonFinal = commentsJson + "}";
    response.setContentType("application/json;");
    response.getWriter().println(commentsJsonFinal);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
      String text = getParameter(request, "text-input", "");
      comments.add(text);
      appendCommentToJson(text);
      addCommentToDataStore(text);

      response.setContentType("application/json;");
      response.getWriter().println(commentsJson + "}");
  }

  private String getParameter(HttpServletRequest request, String name, String defaultValue) {
    String value = request.getParameter(name);
    if (value == null) {
      return defaultValue;
    }
    return value;
  }

  private void appendCommentToJson(String comment) {
      int commentNum = comments.size();
      if (commentNum > 1) {
          commentsJson += ", ";
      }
      commentsJson += "Comment #" + commentNum + ":";
      commentsJson += "\"" + comment + "\"";
  }

  private void addCommentToDataStore(String comment) {
      int commentNum = comments.size();
      String title = "Comment #" + commentNum;

      Entity taskEntity = new Entity("Comment");
      taskEntity.setProperty("title", title);
      taskEntity.setProperty("description", comment);

      DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
      datastore.put(taskEntity);
  }

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
