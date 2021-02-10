//Defines the mapping - pageType in DB to page name to open
var pageMapping = {
		//"pageType in DB"  : "page to open"
		"home"				: "default",
		"exam"				: "default",
		"quizsubject"		: "quiz",
		"test"				: "taketest",
		"testreport"		: "default",
		"leaderboard"		: "default",
		"quiz"				: "takequiz",
		"aboutus"			: "default",
		"contactus"			: "default",
		"disclaimer"		: "disclaimer",
		"emailverification"	: "EmailVerification",
		"passwordreset"		: "default",
		"privacy"			: "default",
		"notfound"			: "default",
		"dashboard"			: "dashboard",
		"video"				: "video",
		"notes"				: "notes",
		"chapter"			: "chapter",
		"course"			: "course",
		"asknanswer"		: "default"
}
var headermenu = [
                  "home", 
                  "exam", 
                  "quizsubject", 
                  "aboutus", 
                  "contactus", 
                  "disclaimer",
                  "emailVerification",
                  "passwordreset",
                  "privacy",
                  "leaderboard",
                  "notfound",
                  "dashboard",
                  "chapter",
                  "course",
                  "asknanswer"
                  ];

var footercontent = [
                     "home", 
                     "exam", 
                     "quizsubject", 
                     "aboutus", 
                     "contactus", 
                     "disclaimer",
                     "emailVerification",
                     "passwordreset",
                     "privacy",
                     "leaderboard",
                     "notfound",
                     "dashboard",
                     "course",
                     "asknanswer"
                     ];

var ItemType = {
		'TEST': 0,
		'QUIZ': 1,
		'VIDEO': 2,
		'NOTES': 3,
		'CHAPTER': 4,
		'COURSE': 5
	};

var ContentType = {
		'EXAM': 0,
		'COURSE': 1
};

var PostType = {
		'QUERY': 0
}