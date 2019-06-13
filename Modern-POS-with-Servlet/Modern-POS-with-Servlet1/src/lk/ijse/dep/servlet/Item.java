package lk.ijse.dep.servlet;

import org.apache.commons.dbcp2.BasicDataSource;

import javax.json.*;
import javax.json.stream.JsonParsingException;
import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;

@WebServlet(urlPatterns = "/Item/*")
public class Item extends HttpServlet {
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
                PreparedStatement pstm = connection.prepareStatement("SELECT *FROM item");
                ResultSet rst = pstm.executeQuery();
                while (rst.next()) {
                    String code = rst.getString("code");
                    String description = rst.getString("description");
                    Double unitPrice = rst.getDouble("unitPrice");
                    int qtyOnHand = rst.getInt("qtyOnHand");
                    ab.add(Json.createObjectBuilder()
                            .add("code", code)
                            .add("description", description)
                            .add("unitPrice", unitPrice)
                            .add("qtyOnHand", qtyOnHand)
                            .build());
                }
                out.println(ab.build().toString());

            } else {
                PreparedStatement pstm = connection.prepareStatement("SELECT *FROM item WHERE code=?");
                pstm.setObject(1, pathInfo.replaceAll("/", ""));
                ResultSet rst = pstm.executeQuery();
                if (rst.next()) {
                    String code = rst.getString("code");
                    String description = rst.getString("description");
                    Double unitPrice = rst.getDouble("unitPrice");
                    int qtyOnHand = rst.getInt("qtyOnHand");
                    JsonObject json = Json.createObjectBuilder()
                            .add("code", code)
                            .add("description", description)
                            .add("unitPrice", unitPrice)
                            .add("qtyOnHand", qtyOnHand)
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

            String code = json.getString("code");
            String description = json.getString("description");
            Double unitPrice = json.getJsonNumber("unitPrice").doubleValue();
            int qtyOnHand = json.getInt("qtyOnHand");

            BasicDataSource dbs = (BasicDataSource) getServletContext().getAttribute("dbpool");
            Connection connection = dbs.getConnection();

            PreparedStatement pstm = connection.prepareStatement("INSERT INTO item VALUES (?,?,?,?)");
            pstm.setObject(1, code);
            pstm.setObject(2, description);
            pstm.setObject(3, unitPrice);
            pstm.setObject(4, qtyOnHand);
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
        } catch (JsonParsingException e) {
            resp.sendError(500);
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            ServletInputStream is = req.getInputStream();
            JsonReader reader = Json.createReader(is);
            JsonObject json = reader.readObject();

            String code = json.getString("code");
            String description = json.getString("description");
            Double unitPrice = json.getJsonNumber("unitPrice").doubleValue();
            int qtyOnHand = json.getInt("qtyOnHand");

            BasicDataSource dbs = (BasicDataSource) getServletContext().getAttribute("dbpool");
            Connection connection = dbs.getConnection();
            PreparedStatement pstm = connection.prepareStatement("UPDATE item SET description=?,unitPrice=?,qtyOnHand=? WHERE code=?");
            pstm.setObject(1, description);
            pstm.setObject(2, unitPrice);
            pstm.setObject(3, qtyOnHand);
            pstm.setObject(4, code);
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
        } catch (JsonParsingException e) {
            resp.sendError(500);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            ServletInputStream is = req.getInputStream();
            JsonReader reader = Json.createReader(is);
            JsonObject json = reader.readObject();

            String code = json.getString("code");

            BasicDataSource dbs = (BasicDataSource) getServletContext().getAttribute("dbpool");
            Connection connection = dbs.getConnection();
            PreparedStatement pstm = connection.prepareStatement("DELETE FROM item WHERE code=?");
            pstm.setObject(1, code);
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
        } catch (JsonParsingException e) {
            resp.sendError(500);
        }
    }
}
