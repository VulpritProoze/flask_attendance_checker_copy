from flask import Flask, render_template, redirect, request, session, flash
from flask_session import Session
import dbhelper, qrcode, qrcode.image.svg, os

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

def generate_qrcode(idno:str):
	try:
		factory = qrcode.image.svg.SvgImage
		qrc = qrcode.make(f"STUDENT_QRCODE_{idno}", image_factory=factory)
		qrc.save(f'static/img/bg-img/qrcodes/{idno}_ALIN_ATTENDANCE_CHECKER.svg')
	except Exception as e:
		flash(f'QRCode Error: {e}')

@app.route('/add_student', methods=['POST'])
def add_student():
	idno:str = request.form.get('idno')
	lastname:str = request.form.get('lastname')
	firstname:str = request.form.get('firstname')
	course:str = request.form.get('course')
	level:str = request.form.get('level')

@app.route('/update_student', methods=['POST'])
def update_student():
	idno:str = request.form.get('idno')
	lastname:str = request.form.get('lastname')
	firstname:str = request.form.get('firstname')
	course:str = request.form.get('course')
	level:str = request.form.get('level')
	isCameraNotFilePicker:bool = request.form.get('modal-edit-flag') == 'on'
	file = request.files.get('image-upload')
	print(f"\n\n{isCameraNotFilePicker}")
	print("data: ", idno, lastname, firstname, course, level)
	# storage_files:list = [os.path.join(uploadfolder, f) for f in os.listdir(uploadfolder)]
	previous_image = dbhelper.getone_record('students', idno=idno)[0]['image']
	ok:bool = False
	if isCameraNotFilePicker:
		image:str = os.path.join(uploadfolder, f"STUDENT_CAMERA_{idno}.jpg")
		print(image, "    idno   ", idno)
		try:	
			os.remove(previous_image)
		except FileNotFoundError as ferr:
			flash(f'Student Update: {ferr}') 
		except Exception as e:
			flash(f'Student Update: {e}')
		file.save(image)
		ok:bool = dbhelper.update_record('students', idno=idno, lastname=lastname, firstname=firstname, course=course, level=level, image=image)
	else:
		filename, extension = os.path.splitext(file.filename)
		image:str = os.path.join(uploadfolder, f"{filename}{idno}{extension}")
		print(image, "    idno   ", idno)
		if image != os.path.join(uploadfolder, idno):
			try:	
				os.remove(previous_image)
			except FileNotFoundError as ferr:
				flash(f'Student Update: {ferr}') 
			except Exception as e:
				flash(f'Student Update: {e}')
			print("prev image: ", previous_image)
			file.save(image)
			ok:bool = dbhelper.update_record('students', idno=idno, lastname=lastname, firstname=firstname, course=course, level=level, image=image)
		else:
			ok:bool = dbhelper.update_record('students', idno=idno, lastname=lastname, firstname=firstname, course=course, level=level)
	# If image to save is still same image, do not save.
		# ok:bool = dbhelper.update_record('students', idno=idno, lastname=lastname, firstname=firstname, course=course, level=level, image=image)

	flash('Student Update: Student updated successfully.') if ok else flash('Student Update: Student failed to update.')
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