var request = window.indexedDB.open("notesDB3",1);
var db ;
   
document.getElementById('addOrEdit').style.display = 'none'; 

request.onsuccess = function(event){
	console.log("onsuccess");
	db = event.target.result;
	var transaction = db.transaction(["notesTbl"],"readwrite");
	var objectStore = transaction.objectStore("notesTbl");
	var request = objectStore.openCursor(null);

    var titleList = document.getElementById('titleList');

    request.onsuccess = function(event){
	var cursor = event.target.result
		if(cursor){
			var li = document.createElement('li');			
			var div = document.createElement('div');
			var att = document.createAttribute("onclick");
			att.value = "viewNotes("+cursor.value.notesID+")";
			div.setAttributeNode(att); 
			div.innerHTML = cursor.value.title;	
			li.appendChild(div);
			console.log(li);
			titleList.appendChild(li);			
			cursor.continue();			
		}
	}
	viewNotes(1);
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
	document.getElementById('display').style.display = 'none'; 
	document.getElementById('addOrEdit').style.display = 'block';  
	document.getElementById('addOrEdit').style.display = 'inline';
	document.getElementById('addOrEdit').display = 'inline-block';
	document.getElementById('hid_Mode').value = "add";
}

function editNotes(){
/*	document.getElementById('display').style.display = 'none'; 
	document.getElementById('addOrEdit').style.display = 'block';  
	document.getElementById('addOrEdit').style.display = 'inline';
	document.getElementById('addOrEdit').display = 'inline-block';

	document.getElementById('hid_Mode').value = "edit";

	document.getElementById('lbl_Title').innerHTML;
	document.getElementById('lbl_GivenDate').innerHTML;
	document.getElementById('lbl_GivenBy').innerHTML;
	document.getElementById('lbl_DueDate').innerHTML;
	document.getElementById('lbl_BriefDescription').innerHTML;
	document.getElementById('lbl_DetailDescription').innerHTML;	*/
}

function saveNotes(){
	var transaction = db.transaction(["notesTbl"],"readwrite");
	var objectStore = transaction.objectStore("notesTbl");

	var li = document.createElement('li');
    var a = document.createElement('a');
	a.innerHTML = document.getElementById('txt_Title').value;
	a.href = "#";
	li.appendChild(a);
	console.log(li);
	titleList.appendChild(li);

	var data = {title: document.getElementById('txt_Title').value, 
				givenDate: document.getElementById('txt_GivenDate').value,
				dueDate: document.getElementById('txt_DueDate').value,
				givenBy: document.getElementById('txt_GivenBy').value,
				briefDescription: document.getElementById('txt_BriefDescription').value,
				detailDescription: document.getElementById('txt_DetailDescription').value};
				 //track of my work logs and remainders for my pending works and respective details as part of self learning and motivation and to encourage me more on real life advancements. Basic construction of qouest contains given on, given by, due date details and to have HTML, CSS, Images required to construct the pliminary based on simple template and get started."};
	
    var request = objectStore.add(data);

    document.getElementById('addOrEdit').style.display = 'none'; 
	document.getElementById('display').style.display = 'block';  
	document.getElementById('display').style.display = 'inline';
	document.getElementById('display').display = 'inline-block';

    request.onsuccess = function(event){   	
    	viewNotes(event.target.result);	
    };
}

function removeNotes(){

}

function viewNotes(noteID){	
	console.log("in get -> "+noteID);
	console.log(document.getElementById('hid_Mode').value);
	var transaction = db.transaction(["notesTbl"],"readonly");
	var objectStore = transaction.objectStore("notesTbl");
	var request = objectStore.openCursor(notesID = noteID);
	request.onsuccess = function(event){
		console.log("suc");
		var cursor = event.target.result;
			console.log(event.target);	
		if(cursor){
			console.log("suc - cursor");			
			document.getElementById('hid_Mode').value = "view";
			document.getElementById('hid_NotesID').value = cursor.value.notesID;
			document.getElementById('lbl_Title').innerHTML = cursor.value.title;
			document.getElementById('lbl_GivenDate').innerHTML = cursor.value.givenDate;
			document.getElementById('lbl_GivenBy').innerHTML = cursor.value.givenBy;
			document.getElementById('lbl_DueDate').innerHTML = cursor.value.dueDate;
			document.getElementById('lbl_BriefDescription').innerHTML = cursor.value.briefDescription;
			document.getElementById('lbl_DetailDescription').innerHTML = cursor.value.detailDescription;			
		}
	}
}



