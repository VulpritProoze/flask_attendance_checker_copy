from flask import Flask, render_template, redirect, request, session, flash, jsonify
from flask_session import Session
import dbhelper, os

app = Flask(__name__)
uploadfolder:str = 'static/img/uploads/'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SECRET_KEY'] = '!@#123!@#4213'
app.config['UPLOAD_FOLDER'] = uploadfolder
Session(app)

def get_users() -> dict:
	return dbhelper.getall_records('users')

def get_students() -> dict:
	return dbhelper.getall_records('students')

def get_recentattendances() -> dict:
	sql:str = f"""
	SELECT s.idno, s.lastname, s.firstname, s.course, s.level, a.date_logged, a.time_logged
	FROM students s
	LEFT JOIN attendance a
	  ON s.idno = a.idno
	  AND (a.date_logged, a.time_logged) IN (
	    SELECT date_logged, time_logged
		FROM attendance
		WHERE idno = s.idno
		ORDER BY date_logged DESC, time_logged DESC
		LIMIT 1)
	WHERE a.attendance_id IS NOT NULL OR a.idno IS NULL 
	"""
	return dbhelper.customget_records('attendance', sql)

def get_attendance() -> dict:
	return dbhelper.getall_records('attendance')

@app.route('/delete_student', methods=['POST'])
def delete_student(): 
	try:
		idno:str = request.form.get('idno')
		record:dict = dict(dbhelper.getone_record('students', idno=idno)[0])
		image:str = record['image']
		qrcode:str = record['qrcode']
		sql:str = f"""
		SELECT attendance_id 
		FROM attendance a 
		JOIN students s ON a.idno = s.idno 
		WHERE s.idno = {idno}
     	"""
		attendances:object = dbhelper.customget_records('attendance', sql)
		for attendance in attendances:
			attendance = dict(attendance)['attendance_id']
			dbhelper.delete_record('attendance', attendance_id=attendance)

		os.remove(image)
		os.remove(qrcode)
	except IndexError:
		flash('Student Delete: idno does not exist')
	except FileNotFoundError:
		flash('Student Delete: Something went wrong with deleting image.')
	except Exception as e:
		flash(f'Student Delete: {e}')
	ok:bool = False
	ok = dbhelper.delete_record('students', idno=idno)
	flash(f'Student Delete: Student deleted successfully.') if ok else flash(f'Student Delete: Student failed to delete.')
	return redirect('/studentlist')

@app.route('/update_student', methods=['POST'])
def update_student():
	idno:str = request.form.get('idno')
	lastname:str = request.form.get('lastname')
	firstname:str = request.form.get('firstname')
	course:str = request.form.get('course')
	level:str = request.form.get('level')
	qrcodefile = request.files.get('qrcode-upload')
	imagefile = request.files.get('image-upload')
	isUpdateNotAdd:str = request.form.get('edit-add-flag') == 'edit'

	print('\n\n')
	print("data: ", idno, lastname, firstname, course, level)
	print("isUpdate: ", isUpdateNotAdd)
	print('qr file: ', qrcodefile)
	print('image file: ', imagefile)
	print('\nrequest.form:   ', request.form)
	print()

	ok:bool = False

	image:str = os.path.join(uploadfolder, f"STUDENT_ATTENDANCE_{idno}.jpg")
	qrcode:str = os.path.join(uploadfolder, f"QRCODE_{idno}.jpg")
	print('image path:  ', image)
	print('qr path:  ', qrcode)

	if isUpdateNotAdd:
		if imagefile.filename != '' and qrcodefile.filename != '':
			imagefile.save(image)
			qrcodefile.save(qrcode)
			ok = dbhelper.update_record('students', idno=idno, lastname=lastname, firstname=firstname, course=course, level=level, qrcode=qrcode, image=image)
		else:
			flash('Student Update: Image not saved')
			ok = dbhelper.update_record('students', idno=idno, lastname=lastname, firstname=firstname, course=course, level=level)
	else:
		try:
			ok = dbhelper.add_record('students', idno=idno, lastname=lastname, firstname=firstname, course=course, level=level, qrcode=qrcode, image=image)		
		except Exception:
			flash('Student Add: Student cannot be added because idno already exists.')
		imagefile.save(image)
		qrcodefile.save(qrcode)

	message_header:str = 'Update' if isUpdateNotAdd else 'Add'
	message_body:str = 'updated' if isUpdateNotAdd else 'added'
	flash(f'Student {message_header}: Student {message_body} successfully.') if ok else flash(f'Student {message_header}: Student failed to {message_header.lower()}.')

	return redirect('/studentlist')

@app.route('/add_attendance', methods=['POST'])
def add_attendance():
	idno:str = request.form.get('idno')
	time_logged:str = request.form.get('time_logged')
	date_logged:str = request.form.get('date_logged')
	print(idno + " " + time_logged + " " + date_logged)
	ok:bool = False
	try:
		ok = dbhelper.add_record('attendance', idno=idno, time_logged=time_logged, date_logged=date_logged)
	except Exception as e:
		flash(f"Add Attendance: Student does not exist {e}")
	flash("Add Attendance: Attendance added successfully.") if ok else flash("Add Attendance: Failed to add attendance.")
	return redirect('/studentlist')

@app.route('/studentlist')
def studentlist():
	if not session.get('name'):
		return redirect('/')
	else:
		return render_template('studentinfo.html', header=True, headerTitle='Student Information List', addStudentModal=True, students=get_students())

@app.route('/attendanceviewer')
def attendanceviewer():
	if not session.get('name'):
		return redirect('/')
	else:
		return render_template('attendanceviewer.html', header=True, headerTitle="Attendance Viewer", addStudentModal=True, attendances=get_recentattendances())

@app.route('/attendancelog')
def attendancelog():
	if not session.get('name'):
		return redirect('/')
	else:
		return render_template('attendancelog.html', header=True, headerTitle="Attendance Log", addStudentModal=True, attendances=get_attendance())

@app.route('/get_student', methods=['POST'])
def get_student():
	idno:str = request.form.get('idno')
	student:object = dict(dbhelper.getone_record('students', idno=idno)[0])
	print(student)
	return jsonify(student)

@app.after_request
def after_request(response):
	response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
	return response

@app.route('/logout', methods=['GET'])
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
			flash('Login Attempt: Login success!')
			return redirect('/studentlist')
		else:
			flash('Login Attempt: Login failed! Username or password is invalid.')
			return redirect('/')

@app.route('/')
def index():
	return render_template('index.html')

if __name__ == '__main__':
	app.run(debug=True)