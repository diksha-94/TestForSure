package edu.tests.TestForSure.sql;

import edu.tests.TestForSure.entity.QuestionBank;

public class CreateQuestionBankQueries {

	public static String insertQuestionBankQueryBuilder(QuestionBank question) {
		String insertQuestion = "INSERT into questionbank (id, question_type, paragraph_text, question_text, optionA, optionB, optionC, optionD, correct_option, explanation, category_bank, subcategory_bank) values ('"+
				question.getId() + "' , '"+question.getQuestion_type() + "' , '"+question.getParagraph_text() + "' , '"+question.getQuestion_text() + "' , '"+
					question.getOptionA() + "' , '"+question.getOptionB() + "' , '"+question.getOptionC()+ "' , '"+question.getOptionD()+ "' , '"+
					question.getCorrect_option()+ "' , '"+question.getExplanation()+ "' , '"+question.getCategory_id()+ "' , '"+question.getSubcategory_id() + "')";
		return insertQuestion;
	}
	
	public static String getLastInsertIdQuestionQueryBuilder(){
		String last_insert_id = "select last_insert_id() as last_id from questionbank";
		return last_insert_id;
	}
	
	public static String updateQuestionBankQueryBuilder(QuestionBank question) {
		String updateQuestion = "UPDATE questionbank SET question_type = '"+question.getQuestion_type()+"',paragraph_text = '"+question.getParagraph_text()+
				"', question_text = '"+question.getQuestion_text()+"', optionA = '"+question.getOptionA()+"', optionB = '"+question.getOptionB()+
				"', optionC = '"+question.getOptionC()+"', optionD = '"+question.getOptionD()+"', correct_option = '"+question.getCorrect_option()+
				"', category_bank = '"+question.getCategory_id()+
				"', subcategory_bank = '"+question.getSubcategory_id()+
				"', explanation = '"+question.getExplanation()+"' WHERE id= '"+question.getId()+"'";
		return updateQuestion;
	}
	public static String questionBankAlreadyExistsQueryBuilder(int id, int test_id) {
		String getquestion = "SELECT * FROM questionbank WHERE id = '" + id + "'";
		return getquestion;
	}
	public static String getQuestionsQueryBuilder() {
		String getQuestion = "SELECT id, test_id, question_type, paragraph_text, question_text, optionA, optionB, optionC, optionD, correct_option, explanation, category_bank, subcategory_bank FROM questionbank WHERE active = 'true'";
		return getQuestion;
	}
	public static String getQuestionsQueryBuilder(int category_id) {
		String getQuestion = "SELECT id, test_id, question_type, paragraph_text, question_text, optionA, optionB, optionC, optionD, correct_option, explanation, category_bank, subcategory_bank FROM questionbank WHERE category_bank = '" + category_id + "' AND active = 'true'";
		return getQuestion;
	}
	public static String getQuestionsQueryBuilder(int category_id, int subcategory_id) {
		String getQuestion = "SELECT id, test_id, question_type, paragraph_text, question_text, optionA, optionB, optionC, optionD, correct_option, explanation, category_bank, subcategory_bank FROM questionbank WHERE category_bank = '" + category_id  + "' AND subcategory_bank = '" + subcategory_id + "' AND active = 'true'";
		return getQuestion;
	}
	public static String deleteQuestionQueryBuilder(String id) {
		String deleteQuestion = "UPDATE questionbank SET active = 'false' WHERE id = '" + id  + "'";
		return deleteQuestion;
	}
	
	public static String getCategoryQueryBuilder() {
		String getCategory = "SELECT * from categorysubjectwise";
		return getCategory;
	}
	
	public static String getSubcategoryQueryBuilder(int cat_id) {
		String getSubcategory = "SELECT id,subcategory from subcategorysubjectwise WHERE cat_id = "+cat_id;
		return getSubcategory;
	}
	
	public static String getCategoryNameQueryBuilder(int id) {
		String getCategory = "SELECT category from categorysubjectwise where id="+id;
		return getCategory;
	}
	
	public static String getSubcategoryNameQueryBuilder(int id) {
		String getSubcategory = "SELECT subcategory from subcategorysubjectwise WHERE id = "+id;
		return getSubcategory;
	}
	
	public static String addNewSubjectCategory(String category) {
		String addCategory = "INSERT into categorysubjectwise (category) values ('" + category +"')";
		return addCategory;
	}
	
	public static String addNewSubjectSubcategory(int cat_id, String subcategory) {
		String addSubcategory = "INSERT into subcategorysubjectwise (cat_id, subcategory) values ('" + cat_id +"', '"+ subcategory+"')";
		return addSubcategory;
	}
	
	public static String getLastInsertIdCategoryQueryBuilder(){
		String last_insert_id = "select last_insert_id() as last_id from categorysubjectwise";
		return last_insert_id;
	}
	
	public static String getLastInsertIdSubcategoryQueryBuilder(){
		String last_insert_id = "select last_insert_id() as last_id from subcategorysubjectwise";
		return last_insert_id;
	}
	
	public static String insertQuestionFromQuestionBank(String question_id){
		String insert_question = "insert into questions (id, test_id, question_type, paragraph_text, question_text, optionA, optionB, optionC, optionD, correct_option, explanation) select id, test_id, question_type, paragraph_text, question_text, optionA, optionB, optionC, optionD, correct_option, explanation from questionbank WHERE id='"+question_id+"'";
		return insert_question;
	}
	
	public static String updateTestIdToQuestionBank(int test_id, String question_id){
		String update_test_id = "update questionbank SET test_id = '" + test_id + "' WHERE id = '" + question_id +"'";
		return update_test_id;
	}
	
	//query to get all the test_id's for particular category id and subcategory id
	public static String getTestIds(int cat_id, int subcat_id){
		String get_test_id = "SELECT id from testdetails WHERE cat_id = '" + cat_id + "' and subcat_id = '" + subcat_id +"'";
		return get_test_id;
	}
	
	//query to get all the question_id's for particular test id
		public static String getQuesIds(int test_id){
			String get_ques_id = "SELECT id from questions WHERE test_id = '" + test_id +"' AND active='true'";
			return get_ques_id;
		}
	
}
