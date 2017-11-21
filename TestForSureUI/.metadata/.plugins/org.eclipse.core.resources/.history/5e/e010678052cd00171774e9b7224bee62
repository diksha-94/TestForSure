package edu.tests.TestForSure.datalayer;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

import edu.tests.TestForSure.common.DBConnection;
import edu.tests.TestForSure.entity.TestReports;
import edu.tests.TestForSure.entity.TestSolution;
import edu.tests.TestForSure.response.GetTestReportResponse;
import edu.tests.TestForSure.response.GetTestSoltionResponse;
import edu.tests.TestForSure.sql.CreateTestQueries;
import edu.tests.TestForSure.sql.CreateTestReportQueries;

public class TestReportDAO {
	
	public static GetTestReportResponse getTestReport(int test_id, String email_id){
		System.out.println("Calling DAO");
		//this query is to check whether the test is already attempted by particular user or to get all the reports of a user for a particular test
		String query = CreateTestQueries.checkAlreadyAttempted(test_id, email_id);
		System.out.println("Query: "+query);
		Connection conn = DBConnection.getDBConnection();
		ResultSet rs = null;
		GetTestReportResponse response = new GetTestReportResponse();
		TestReports report = null;
		ArrayList<TestReports> testReports = new ArrayList<TestReports>();
		try{
			Statement statement = conn.createStatement();
			rs = statement.executeQuery(query);
			if(rs.isBeforeFirst()){
				while(rs.next()){
					report = new TestReports();
					report.setId(rs.getInt(1));
					report.setTest_id(rs.getInt(2));
					report.setUsername(rs.getString(3));
					report.setEmailid(rs.getString(4));
					report.setMobile_number(rs.getLong(5));
					report.setMarks_scored(rs.getBigDecimal(6));
					report.setTime_taken(rs.getBigDecimal(7));
					report.setRank(rs.getInt(8));
					report.setQuestions_attempted(rs.getInt(9));
					report.setCorrect_ques(rs.getInt(10));
					report.setIncorrect_ques(rs.getInt(11));
					report.setTotal_ques(rs.getInt(12));
					report.setLast_updated_on(rs.getDate(13));
					
					testReports.add(report);
				}
				response.setTestReports(testReports);
				response.setStatus(true);
			}
			else{
				response.setStatus(false);
				response.setMessage("Problem in getting test reports");
			}
		}
		catch(Exception e){
			System.out.println("Exception from DAO: "+e.getMessage());
			response.setStatus(false);
			response.setMessage(e.getMessage());
		}finally {
			try {
				if (conn != null)
					conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
				response.setStatus(false);
				response.setMessage(e.getMessage());
			}
		}
		
		return response;
	}
	
	public static GetTestSoltionResponse getTestSolution(int test_report_id){
		System.out.println("Calling DAO");
		String query = CreateTestReportQueries.getTestSolution(test_report_id);
		System.out.println("Query: "+query);
		Connection conn = DBConnection.getDBConnection();
		ResultSet rs = null;
		GetTestSoltionResponse response = new GetTestSoltionResponse();
		TestSolution solution = null;
		ArrayList<TestSolution> testSolutions = new ArrayList<TestSolution>();
		try{
			Statement statement = conn.createStatement();
			rs = statement.executeQuery(query);
			if(rs.isBeforeFirst()){
				while(rs.next()){
					
					
					solution = new TestSolution();
					solution.setId(rs.getInt(1));
					solution.setTest_id(rs.getInt(2));
					solution.setQues_id(rs.getString(3));
					solution.setUsername(rs.getString(4));
					solution.setCorret(rs.getBoolean(5));
					solution.setTime_spent(rs.getInt(6));
					solution.setCorrect_option(rs.getString(7));
					solution.setMarked_option(rs.getString(8));
					solution.setExplanation(rs.getString(9));
					solution.setTest_report_id(rs.getInt(10));
					
					testSolutions.add(solution);
				}
				response.setSolution(testSolutions);
				response.setStatus(true);
			}
			else{
				response.setStatus(false);
				response.setMessage("Problem in getting test reports");
			}
		}
		catch(Exception e){
			System.out.println("Exception from DAO: "+e.getMessage());
			response.setStatus(false);
			response.setMessage(e.getMessage());
		}finally {
			try {
				if (conn != null)
					conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
				response.setStatus(false);
				response.setMessage(e.getMessage());
			}
		}
		
		return response;
	}
}
