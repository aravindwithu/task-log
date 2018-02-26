

var request = window.indexedDB.open("notesDB",1);
var db ;
var initID ;
   
document.getElementById('addOrEdit').style.display = 'none'; 

request.onsuccess = function(event){
	console.log("onsuccess");	
    var initCnt = 0;
	db = event.target.result;
	var transaction = db.transaction(["notesTbl"],"readwrite");
	var objectStore = transaction.objectStore("notesTbl");	   
    var request = objectStore.openCursor(null); 
    request.onsuccess = function(event){
	var cursor = event.target.result;
		if(cursor){			
			var li = document.createElement('li');			
			var div = document.createElement('div');
			var att = document.createAttribute("onclick");
			att.value = "viewNotes("+cursor.value.notesID+")";
			div.setAttributeNode(att); 
			var classAtt = document.createAttribute("class");
			classAtt.value = "btn";
			div.setAttributeNode(classAtt); 
			div.innerHTML = cursor.value.title;	
			li.appendChild(div);
			console.log(li);
			titleList.appendChild(li);	

			if(initCnt == 0){
				initID = cursor.value.notesID;
				initCnt++;
			}

			cursor.continue();			
		}
	}
	console.log(initID);
	viewNotes(initID);
};

request.onerror = function(event){
	console.log("onerror");
};

request.onupgradeneeded = function(event){
	console.log("onupgradeneeded");
	db = event.target.result;
	var objStore = db.createObjectStore("notesTbl", {keyPath:"notesID", autoIncrement:true});
	objStore.createIndex("title", "title", {unique:false});
	objStore.createIndex("givenDate", "givenDate", {unique:false});
	objStore.createIndex("dueDate", "dueDate", {unique:false});
	objStore.createIndex("givenBy", "givenBy", {unique:false});
	objStore.createIndex("briefDescription", "briefDescription", {unique:false});
	objStore.createIndex("detailDescription", "detailDescription", {unique:false});
};

function addNotes(){ 	
	showAddOrEdit();
	hideValidation(); 
	document.getElementById('hid_NotesID').value = 0;
    clearTxts();
}

function editNotes(){
	showAddOrEdit();
	hideValidation(); 
	document.getElementById('txt_Title').value = document.getElementById('lbl_Title').innerHTML;
	document.getElementById('txt_GivenDate').value = document.getElementById('lbl_GivenDate').innerHTML;
	document.getElementById('txt_DueDate').value = document.getElementById('lbl_DueDate').innerHTML;
	document.getElementById('txt_GivenBy').value = document.getElementById('lbl_GivenBy').innerHTML;	
	document.getElementById('txt_BriefDescription').value = document.getElementById('lbl_BriefDescription').innerHTML;
	document.getElementById('txt_DetailDescription').value = document.getElementById('lbl_DetailDescription').innerHTML;
}

function cancelNotes(noteID){
	if(noteID == 0){
		viewNotes(initID); 
	}
	else{
		viewNotes(notesID); 
	}
}

function saveNotes(noteID){
	validate();
	console.log("Error no : "+ document.getElementById('hid_Error').value);
	if(document.getElementById('hid_Error').value == 0){
		if(noteID == 0){		
			var transaction = db.transaction(["notesTbl"],"readwrite");
			var objectStore = transaction.objectStore("notesTbl");

			var data = {title: document.getElementById('txt_Title').value, 
						givenDate: document.getElementById('txt_GivenDate').value,
						dueDate: document.getElementById('txt_DueDate').value,
						givenBy: document.getElementById('txt_GivenBy').value,
						briefDescription: document.getElementById('txt_BriefDescription').value,
						detailDescription: document.getElementById('txt_DetailDescription').value};
						 
		    var request = objectStore.add(data);
		    request.onsuccess = function(event){
		       	var li = document.createElement('li');			
				var div = document.createElement('div');
				var att = document.createAttribute("onclick");
				att.value = "viewNotes("+event.target.result+")";
				div.setAttributeNode(att); 
				var classAtt = document.createAttribute("class");
				classAtt.value = "btn";
				div.setAttributeNode(classAtt); 
				div.innerHTML = document.getElementById('txt_Title').value;
				li.appendChild(div);
				console.log(li);
				titleList.appendChild(li);
		    	viewNotes(event.target.result);	
		    };
		}
		else{
			var transaction = db.transaction(['notesTbl'], 'readwrite');
		    var objStore = transaction.objectStore('notesTbl');
		    var request = objStore.get(Number(noteID));
		    request.onsuccess = function() {
		    	var data = request.result;
		    	data.title = document.getElementById('txt_Title').value;
				data.givenDate= document.getElementById('txt_GivenDate').value;
				data.dueDate= document.getElementById('txt_DueDate').value;
				data.givenBy= document.getElementById('txt_GivenBy').value;
				data.briefDescription= document.getElementById('txt_BriefDescription').value;
				data.detailDescription= document.getElementById('txt_DetailDescription').value;
				var reqUpdate = objStore.put(data);
				reqUpdate.onsuccess = function() {
		    		console.log('Notes updated successfully - ' + noteID);
			    	viewNotes(notesID);  
			    }
		    };
		}
	}
}

function removeNotes(noteID){
    var transaction = db.transaction(['notesTbl'], 'readwrite');
    var objStore = transaction.objectStore('notesTbl');
    var request = objStore.delete(Number(noteID));
    request.onsuccess = function() {
    	console.log('Notes deleted successfully - ' + noteID);
	    //viewNotes(notesID++);  
	    location.reload();
    };
}

function viewNotes(noteID){	
	console.log("Note ID -> "+noteID);
	clearTxts();
	document.getElementById('default').style.display = 'none'; 
	document.getElementById('addOrEdit').style.display = 'none'; 
	document.getElementById('display').style.display = 'block';  
	document.getElementById('display').style.display = 'inline';
	document.getElementById('display').display = 'inline-block';
	document.getElementById('addBtn').disabled = false;
	var transaction = db.transaction(["notesTbl"],"readonly");
	var objStore = transaction.objectStore("notesTbl");
	var request = objStore.openCursor(notesID = noteID);
	request.onsuccess = function(event){
		var cursor = event.target.result;
		if(cursor){				
			document.getElementById('hid_NotesID').value = cursor.value.notesID;
			document.getElementById('lbl_Title').innerHTML = cursor.value.title;
			document.getElementById('lbl_GivenDate').innerHTML = cursor.value.givenDate;
			document.getElementById('lbl_GivenBy').innerHTML = cursor.value.givenBy;
			document.getElementById('lbl_DueDate').innerHTML = cursor.value.dueDate;
			document.getElementById('lbl_BriefDescription').innerHTML = cursor.value.briefDescription;
			document.getElementById('lbl_DetailDescription').innerHTML = cursor.value.detailDescription;
			var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
			var firstDate = new Date(cursor.value.givenDate);
			var secondDate = new Date(cursor.value.dueDate);
			var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
			document.getElementById('lbl_DueDays').innerHTML = " ~ Remaining " + diffDays + " days to go...";
		}
		else{
			document.getElementById('hid_NotesID').value = 0;
			clearLbls();
			loadDefault();
		}
	}
	request.onerror = function(event){
		document.getElementById('hid_NotesID').value = 0;
		clearLbls();
		loadDefault();
	}

}

function loadDefault(){
	document.getElementById('display').style.display = 'none'; 
	document.getElementById('addOrEdit').style.display = 'none'; 
	document.getElementById('addBtn').disabled = false;
	document.getElementById('default').style.display = 'block';  
	document.getElementById('default').style.display = 'inline';
	document.getElementById('default').display = 'inline-block';
}

function showAddOrEdit(){
	document.getElementById('default').style.display = 'none'; 
	document.getElementById('display').style.display = 'none'; 
	document.getElementById('addOrEdit').style.display = 'block';  
	document.getElementById('addOrEdit').style.display = 'inline';
	document.getElementById('addOrEdit').display = 'inline-block';
	document.getElementById('addBtn').disabled = true;
}

function clearLbls(){
	document.getElementById('lbl_Title').innerHTML = "";
	document.getElementById('lbl_GivenDate').innerHTML = "";
	document.getElementById('lbl_GivenBy').innerHTML = "";
	document.getElementById('lbl_DueDate').innerHTML = "";
	document.getElementById('lbl_BriefDescription').innerHTML = "";
	document.getElementById('lbl_DetailDescription').innerHTML = "";		
}

function clearTxts(){
	document.getElementById('txt_Title').value = "";
	document.getElementById('txt_GivenDate').value = "";
	document.getElementById('txt_DueDate').value = "";
	document.getElementById('txt_GivenBy').value = "";	
	document.getElementById('txt_BriefDescription').value = "";
	document.getElementById('txt_DetailDescription').value = "";
}

function validate(){
	document.getElementById('hid_Error').value = 0;
	document.getElementById('valDiv').style.display = 'block';  
	document.getElementById('valDiv').style.display = 'inline';
	document.getElementById('valDiv').display = 'inline-block';

    document.getElementById('lbl_TitleEmpty').style.display = 'none'; 
	document.getElementById('lbl_GivenDateEmpty').style.display = 'none'; 
	document.getElementById('lbl_GivenByEmpty').style.display = 'none'; 
	document.getElementById('lbl_DueDateEmpty').style.display = 'none'; 
	document.getElementById('lbl_BriefDescriptionEmpty').style.display = 'none'; 
	document.getElementById('lbl_DueDateCheck').style.display = 'none';     

    if(document.getElementById('txt_Title').value == ""){
		document.getElementById('lbl_TitleEmpty').style.display = 'block';  
		document.getElementById('lbl_TitleEmpty').style.display = 'inline';
		document.getElementById('lbl_TitleEmpty').display = 'inline-block';
		document.getElementById('hid_Error').value = 1;
	}

	if(document.getElementById('txt_GivenDate').value == ""){
		document.getElementById('lbl_GivenDateEmpty').style.display = 'block';  
		document.getElementById('lbl_GivenDateEmpty').style.display = 'inline';
		document.getElementById('lbl_GivenDateEmpty').display = 'inline-block';
		document.getElementById('hid_Error').value = 2;
	}

	if(document.getElementById('txt_GivenBy').value == ""){
		document.getElementById('lbl_GivenByEmpty').style.display = 'block';  
		document.getElementById('lbl_GivenByEmpty').style.display = 'inline';
		document.getElementById('lbl_GivenByEmpty').display = 'inline-block';
		document.getElementById('hid_Error').value = 3;
	}

	if(document.getElementById('txt_DueDate').value == ""){
		document.getElementById('lbl_DueDateEmpty').style.display = 'block';  
		document.getElementById('lbl_DueDateEmpty').style.display = 'inline';
		document.getElementById('lbl_DueDateEmpty').display = 'inline-block';
		document.getElementById('hid_Error').value = 4;
	}

	if(document.getElementById('txt_BriefDescription').value == ""){
		document.getElementById('lbl_BriefDescriptionEmpty').style.display = 'block';  
		document.getElementById('lbl_BriefDescriptionEmpty').style.display = 'inline';
		document.getElementById('lbl_BriefDescriptionEmpty').display = 'inline-block';
		document.getElementById('hid_Error').value = 5;
	}

	if(document.getElementById('txt_GivenDate').value > document.getElementById('txt_DueDate').value){
		document.getElementById('lbl_DueDateCheck').style.display = 'block';  
		document.getElementById('lbl_DueDateCheck').style.display = 'inline';
		document.getElementById('lbl_DueDateCheck').display = 'inline-block';
		document.getElementById('hid_Error').value = 6;
	}
}

function hideValidation(){
	document.getElementById('lbl_TitleEmpty').style.display = 'none'; 
	document.getElementById('lbl_GivenDateEmpty').style.display = 'none'; 
	document.getElementById('lbl_GivenByEmpty').style.display = 'none'; 
	document.getElementById('lbl_DueDateEmpty').style.display = 'none'; 
	document.getElementById('lbl_BriefDescriptionEmpty').style.display = 'none'; 
	document.getElementById('lbl_DueDateCheck').style.display = 'none'; 
	document.getElementById('valDiv').style.display = 'none'; 
}
