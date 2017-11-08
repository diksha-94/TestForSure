package edu.tests.TestForSure.entity;

import java.util.ArrayList;

public class GetTestResultRequest {
	private UserDetails userDetails;
	private Double time_rem;
	private TestId testDetails;
	private ArrayList<Result> result;
	public TestId getTestDetails() {
		return testDetails;
	}
	public void setTestDetails(TestId testDetails) {
		this.testDetails = testDetails;
	}
	public Double getTime_rem() {
		return time_rem;
	}
	public void setTime_rem(Double time_rem) {
		this.time_rem = time_rem;
	}
	public ArrayList<Result> getResult() {
		return result;
	}
	public void setResult(ArrayList<Result> result) {
		this.result = result;
	}
	public UserDetails getUserDetails() {
		return userDetails;
	}
	public void setUserDetails(UserDetails userDetails) {
		this.userDetails = userDetails;
	}
	@Override
	public String toString() {
		return "GetTestResultRequest [testDetails=" + testDetails + ", result=" + result + ", userDetails=" + userDetails +",time_rem=" + time_rem + "]";
	}
	public GetTestResultRequest(UserDetails userDetails, Double time_rem, TestId testDetails, ArrayList<Result> result) {
		super();
		this.userDetails = userDetails;
		this.time_rem = time_rem;
		this.testDetails = testDetails;
		this.result = result;
	}
	public GetTestResultRequest() {
		super();
	}
}