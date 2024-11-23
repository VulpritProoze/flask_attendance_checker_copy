from sqlite3 import connect, Row

database = 'studentinfo.db'


def getprocess(sql:str) -> object:
	db:object = connect(database)
	cursor:object = db.cursor()
	cursor.execute(sql)
	cursor.row_factory = Row
	data:dict = cursor.fetchall()
	db.close()
	return data

def postprocess(sql:str) -> bool:
	db:object = connect(database)
	cursor:object = db.cursor()
	cursor.execute(sql)
	db.commit()
	return True if cursor.rowcount > 0 else False

def getone_record(table:str, **kwargs) -> object:
	sql:str = f"SELECT * FROM {table} WHERE {list(kwargs.keys())[0]} = '{list(kwargs.values())[0]}'"
	print("Get One Record: ", sql)
	return getprocess(sql)

def getall_records(table:str) -> dict:
	sql:str = f"SELECT * FROM {table}"
	data = getprocess(sql)
	print(f"RECORDS: {[d for d in data]}")
	return data 

def delete_record(table:str, **kwargs) -> bool:
	sql:str = f"DELETE FROM {table} WHERE `{list(kwargs.keys())[0]}` = '{list(kwargs.values())[0]}'"
	print(f"DELETE: {sql}")
	return postprocess(sql)

def add_record(table:str, **kwargs) -> bool:
	keys:list = list(kwargs.keys())
	values:list = list(kwargs.values())
	columns:str = ','.join(keys)
	valuesField:str = ','.join([f"'{value}'" for value in values])
	sql:str = f"INSERT INTO {table} ({columns}) values({valuesField})"
	print(f"ADD: {sql}")
	return postprocess(sql)

def update_record(table:str, **kwargs) -> bool:
	keys:list = list(kwargs.keys())
	values:list = list(kwargs.values())
	fields:list = []
	for i in range(len(keys)-1):
		fields.append(f"{keys[i+1]} = '{values[i+1]}'")
	fields:str = ','.join(fields)
	sql:str = f"UPDATE {table} SET {fields} WHERE `{keys[0]}` = '{values[0]}'"
	print(f"UPDATE: {sql}")
	return postprocess(sql)

# if __name__ == "__main__":
	# delete_record('users', id='123')
	# add_record('users', username='asd')
	# getall_records('users')
	# add_record('students', idno='1000', lastname='Alinium')