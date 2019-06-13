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

@WebServlet(urlPatterns = "/Order/*")
public class Order extends HttpServlet {
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
                PreparedStatement pstm = connection.prepareStatement("SELECT *FROM `order`");
                ResultSet rst = pstm.executeQuery();
                while (rst.next()) {
                    int id = rst.getInt("id");
                    Date date = rst.getDate("date");
                    int customerId = rst.getInt("customerId");
                    ab.add(Json.createObjectBuilder()
                            .add("id", id)
                            .add("date", date.toString())
                            .add("cutomerId", customerId)
                            .build());
                }
                out.println(ab.build().toString());


            }else {
                PreparedStatement pstm = connection.prepareStatement("SELECT *FROM `order` WHERE id=?");
                pstm.setObject(1,pathInfo.replaceAll("/",""));
                ResultSet rst = pstm.executeQuery();
                if (rst.next()) {
                    int id = rst.getInt("id");
                    Date date = rst.getDate("date");
                    int customerId = rst.getInt("customerId");
                    JsonObject json = Json.createObjectBuilder()
                            .add("id", id)
                            .add("date", date.toString())
                            .add("cutomerId", customerId)
                            .build();
                    out.println(json.toString());

                }else {
                    resp.sendError(404);
                }

            }
            connection.close();
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

        Connection connection = null;
        try {
            ServletInputStream is = req.getInputStream();
            JsonReader reader = Json.createReader(is);
            JsonObject json = reader.readObject();

            int id = json.getInt("id");
            String date = json.getString("date");
            int customerId = json.getInt("customerId");

            BasicDataSource dbs = (BasicDataSource) getServletContext().getAttribute("dbpool");
            connection = dbs.getConnection();
            //Begin Transaction
            connection.setAutoCommit(false);

            PreparedStatement pstm = connection.prepareStatement("INSERT INTO `order` VALUES (?,?,?)");
            pstm.setObject(1, id);
            pstm.setObject(2, Date.valueOf(date));
            pstm.setObject(3, customerId);
            boolean result = pstm.executeUpdate() > 0;


            JsonArray orderDetail = json.getJsonArray("orderDetail");
            for (int i = 0; i < orderDetail.size(); i++) {

                JsonObject jsonObject = orderDetail.getJsonObject(i);
                int orderId = jsonObject.getInt("orderId");
                String code = jsonObject.getString("itemCode");
                int qty = jsonObject.getInt("qty");
                double unitPrice = jsonObject.getJsonNumber("unitPrice").doubleValue();

                PreparedStatement pstm1 = connection.prepareStatement("INSERT INTO orderdetail VALUES (?,?,?,?)");
                pstm1.setObject(1, orderId);
                pstm1.setObject(2, code);
                pstm1.setObject(3, qty);
                pstm1.setObject(4,unitPrice);

                boolean result1 = pstm1.executeUpdate() > 0;

                PreparedStatement pstm2 = connection.prepareStatement("SELECT qtyOnHand FROM item WHERE code=?");
                pstm2.setObject(1,code);
                ResultSet rst = pstm2.executeQuery();
                int qtyOnHand=0;
                if (rst.next()){
                   qtyOnHand = rst.getInt("qtyOnHand");
                }

                PreparedStatement pstm3 = connection.prepareStatement("UPDATE item SET qtyOnHand=? WHERE code=?");
                pstm3.setObject(1,(qtyOnHand-qty));
                pstm3.setObject(2,code);
                boolean result2 = pstm3.executeUpdate() > 0;
                if (result && result1 && result2){
                    resp.setStatus(200);
                }else {
                    resp.sendError(500);
                    connection.rollback();
                }
            }

//            System.out.println("------------------");
//            JsonObject jsonObject = orderDetail.getJsonObject(0);
//            int code = jsonObject.getInt("orderId");
//            JsonObject jsonObject1 = orderDetail.getJsonObject(1);
//            String code1 = jsonObject1.getString("itemCode");
//            System.out.println(code);
//            System.out.println("--------------");
//            System.out.println(code1);

            connection.commit();

        } catch (SQLException e) {
            e.printStackTrace();
            resp.sendError(500);
            try {
                connection.rollback();
            } catch (SQLException e1) {
                e1.printStackTrace();
            }
        } catch (JsonParsingException e){
            resp.sendError(500);
        } finally {
            try {
                connection.setAutoCommit(true);
                connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}
