
// the model part of MVU
// note that there's no point in waiting to load the data
// until window.onload() is fired, since Sandelin's script
// is already at the bottom of the body. this is functionally equivalent
var data = (localStorage.getItem('todoList')) ?
	JSON.parse(localStorage.getItem('todoList')) :
	{ todo: [], completed: [] };

// listening for new items (event -> update (addItem) -> render)
document.getElementById('add').addEventListener('click', function() {
	var value = document.getElementById('item').value;
	if (value) {
		addItem(value);
		render();
	}
});
document.getElementById('item').addEventListener('keydown', function (e) {
	var value = this.value;
	if (e.keyCode === 13 && value) {
		addItem(value);
		render();
	}
});

// Remove and complete icons in SVG format
var removeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect class="noFill" width="22" height="22"/><g><g><path class="fill" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6V18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="fill" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="fill" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="fill" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></g></svg>';
var completeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect y="0" class="noFill" width="22" height="22"/><g><path class="fill" d="M9.7,14.4L9.7,14.4c-0.2,0-0.4-0.1-0.5-0.2l-2.7-2.7c-0.3-0.3-0.3-0.8,0-1.1s0.8-0.3,1.1,0l2.1,2.1l4.8-4.8c0.3-0.3,0.8-0.3,1.1,0s0.3,0.8,0,1.1l-5.3,5.3C10.1,14.3,9.9,14.4,9.7,14.4z"/></g></svg>';

// only put it all in local storage when it needs to be put there
window.addEventListener("beforeunload", function() {
	localStorage.setItem('todoList', JSON.stringify(data));
});

// build the dom from data
render();
// ....and now we wait





/////// --- functions ----- //////////

function addItem(value) { // the update part of MVU
	data.todo.push(value);
	/* prof said he prefers none of this sort of function "chaining," if you will */
	//  render(); // with a call to the view once it's been updated
}

// also part of the update part of MVU
// completed is false if item's in todo list
// this way it knows which list to remove from
function removeItem(index, completed) {
	if (completed) data.completed.splice(index, 1);
	else data.todo.splice(index, 1);
	//render();
}

function completeItem(index, completed) { // see removeItem() comment
	if (completed) {
		var value = data.completed[index];
		data.completed.splice(index, 1);
		data.todo.push(value);
	} else {
		var value = data.todo[index];
		data.todo.splice(index, 1);
		data.completed.push(value);
	}
	//render();
}

function render() { // build the elements from the list and insert into dom (view part of MVU)
	document.getElementById('item').value = '';

	// prof. said it's fine if we just rebuild the elements on each change
	// you can do it the fancy way if you feel like it though.
	document.getElementById('todo').innerHTML = "";
	document.getElementById('completed').innerHTML = "";

	if (!data.todo.length && !data.completed.length) return;

	for (let i = 0; i < data.todo.length; i++)
		addItemToDOM(data.todo[i], false, i);

	for (let j = 0; j < data.completed.length; j++)
		addItemToDOM(data.completed[j], true, j);
}

function addItemToDOM(text, completed, index) { // helper function for render()
	var list = (completed) ? document.getElementById('completed') : document.getElementById('todo');

	var item = document.createElement('li');
	item.innerText = text;
/**** todo: add a title attribute for this <li> containing the date and time this was created ******/

	var buttons = document.createElement('div');
	buttons.classList.add('buttons');

	var remove = document.createElement('button');
	remove.classList.add('remove');
	remove.innerHTML = removeSVG;
	remove.addEventListener('click', function() {
		removeItem(index, completed);
		render();
	});

	var complete = document.createElement('button');
	complete.classList.add('complete');
	complete.innerHTML = completeSVG;
	complete.addEventListener('click', function() {
		completeItem(index, completed);
		render();
	});

	buttons.appendChild(remove);
	buttons.appendChild(complete);
	item.appendChild(buttons);
	list.insertBefore(item, list.childNodes[0]);
}
