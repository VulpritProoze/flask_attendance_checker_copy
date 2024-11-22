from flask import Flask, render_template, redirect, request, session, flash
from flask_session import Session
import dbhelper

app = Flask(__name__)
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SECRET_KEY'] = '!@#123!@#4213'
Session(app)

def get_users() -> dict:
	return dbhelper.getall_records('users')

def get_students() -> dict:
	return dbhelper.getall_records('students')

@app.route('/update_student', methods=['POST'])
def update_student():
	idno:str = request.form.get('idno')
	lastname:str = request.form.get('lastname')
	firstname:str = request.form.get('firstname')
	course:str = request.form.get('course')
	level:str = request.form.get('level')
	ok:bool = dbhelper.update_record('students', idno=idno, lastname=lastname, firstname=firstname, course=course, level=level)
	if ok:
		flash('Student Update: Student updated successfully.')
	else:
		flash('Student Update: Student failed to update.')
	return redirect('/studentlist')

@app.route('/studentlist')
def studentlist():
	if not session.get('name'):
		return redirect('/')
	else:
		return render_template('studentinfo.html', header=True, students=get_students(), headerTitle='Student Information List')

@app.after_request
def after_request(response):
	response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
	return response

@app.route('/logout', methods=['POST'])
def logout():
	session['name'] = None
	return redirect('/')

@app.route('/login', methods=['POST', 'GET'])
def login():
	username:str = request.form['username']
	password:str = request.form['password']
	users:dict = get_users()
	for user in users:
		if username == user['username'] and password == user['password']:
			session['name'] = username
			return redirect('/studentlist')
		else:
			return redirect('/')

@app.route('/')
def index():
	return render_template('index.html')

if __name__ == '__main__':
	app.run(debug=True)