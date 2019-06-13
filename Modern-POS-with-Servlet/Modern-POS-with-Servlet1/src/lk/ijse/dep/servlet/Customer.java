package lk.ijse.dep.servlet;

import org.apache.commons.dbcp2.BasicDataSource;

import javax.json.*;
import javax.json.stream.JsonParsingException;
import javax.servlet.ServletContext;
import javax.servlet.ServletContextListener;
import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;

@WebServlet(urlPatterns = "/customer/*")
public class Customer extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");

        Connection connection = null;

        try (PrintWriter out = resp.getWriter()) {

            String pathInfo = req.getPathInfo();

            BasicDataSource dbs = (BasicDataSource) getServletContext().getAttribute("dbpool");
            connection = dbs.getConnection();
            JsonArrayBuilder ab = Json.createArrayBuilder();

            if (pathInfo == null || pathInfo == "/") {
                PreparedStatement pstm = connection.prepareStatement("SELECT *FROM Customer");
                ResultSet rst = pstm.executeQuery();
                while (rst.next()) {
                    int id = rst.getInt("id");
                    String name = rst.getString("name");
                    String address = rst.getString("address");
                    ab.add(Json.createObjectBuilder()
                            .add("id", id)
                            .add("name", name)
                            .add("address", address)
                            .build());
                }
                out.println(ab.build().toString());

            } else {
                PreparedStatement pstm = connection.prepareStatement("SELECT *FROM Customer WHERE id=?");
                pstm.setObject(1, pathInfo.replaceAll("/", ""));
                ResultSet rst = pstm.executeQuery();
                if (rst.next()) {
                    int id = rst.getInt("id");
                    String name = rst.getString("name");
                    String address = rst.getString("address");
                    JsonObject json = Json.createObjectBuilder()
                            .add("id", id)
                            .add("name", name)
                            .add("address", address)
                            .build();
                    out.println(json.toString());

                } else {
                    resp.sendError(404);
                }

            }

        } catch (SQLException e) {
            e.printStackTrace();
        }finally {
            try {
                connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {


        try {
            ServletInputStream is = req.getInputStream();
            JsonReader reader = Json.createReader(is);
            JsonObject json = reader.readObject();

            int id = json.getInt("id");
            String name = json.getString("name");
            String address = json.getString("address");

            BasicDataSource dbs = (BasicDataSource) getServletContext().getAttribute("dbpool");
            Connection connection = dbs.getConnection();

            PreparedStatement pstm = connection.prepareStatement("INSERT INTO customer VALUES (?,?,?)");
            pstm.setObject(1, id);
            pstm.setObject(2, name);
            pstm.setObject(3, address);
            boolean result = pstm.executeUpdate() > 0;
            if (result) {
                resp.setStatus(200);
            } else {
                resp.sendError(500);
            }

            connection.close();

        } catch ( SQLException e) {
            e.printStackTrace();
            resp.sendError(500);
        } catch (JsonParsingException e){
            resp.sendError(500);
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            ServletInputStream is = req.getInputStream();
            JsonReader reader = Json.createReader(is);
            JsonObject json = reader.readObject();

            int id = json.getInt("id");
            String name = json.getString("name");
            String address = json.getString("address");

            BasicDataSource dbs = (BasicDataSource) getServletContext().getAttribute("dbpool");
            Connection connection = dbs.getConnection();

            PreparedStatement pstm = connection.prepareStatement("UPDATE customer SET name=?,address=? WHERE id=?");
            pstm.setObject(1, name);
            pstm.setObject(2, address);
            pstm.setObject(3, id);
            boolean result = pstm.executeUpdate() > 0;
            if (result) {
                resp.setStatus(200);
            } else {
                resp.sendError(500);
            }

            connection.close();
        } catch (SQLException e) {
            e.printStackTrace();
            resp.sendError(500);
        } catch (JsonParsingException e){
            resp.sendError(500);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            ServletInputStream is = req.getInputStream();
            JsonReader reader = Json.createReader(is);
            JsonObject json = reader.readObject();
            int id = json.getInt("id");


            BasicDataSource dbs = (BasicDataSource) getServletContext().getAttribute("dbpool");
            Connection connection = dbs.getConnection();
            PreparedStatement pstm = connection.prepareStatement("DELETE FROM customer WHERE id=?");
            pstm.setObject(1, id);
            boolean result = pstm.executeUpdate() > 0;
            if (result) {
                resp.setStatus(200);
            } else {
                resp.sendError(500);
            }

            connection.close();
        } catch (SQLException e) {
            e.printStackTrace();
            resp.sendError(500);
        } catch (JsonParsingException e){
            resp.sendError(500);
        }
    }

}