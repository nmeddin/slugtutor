# Define your tables below (or better in another model file) for example
#
# >>> db.define_table('mytable', Field('myfield', 'string'))
#
# Fields can be 'string','text','password','integer','double','boolean'
#       'date','time','datetime','blob','upload', 'reference TABLENAME'
# There is an implicit 'id integer autoincrement' field
# Consult manual for more options, validators, etc.

import datetime


def get_user_email():
    return auth.user.email if auth.user is not None else None

def get_user_name():
    return auth.user.first_name + auth.user.last_name if auth.user is not None else None

db.define_table('appointments',
			   Field('classname'),
	           Field('appointment', 'datetime'),
	           Field('tutor'),
	           Field('can_cancel', 'boolean', default=True),
	           Field('student'),
	           Field('rate', 'double', default=20.00),
	           primarykey=['appointment', 'tutor']
	           )

db.appointments.tutor.writable = False
db.appointments.tutor.readable = False
db.appointments.can_cancel.writable = False
db.appointments.can_cancel.readable = False




db.define_table('tutor',
                Field('name'),
                Field('email'),
                Field('major'),
                Field('academic_year'),
                Field('classes'),
                Field('rating', 'double', default=0.0),
                primarykey=['name', 'email', 'major']
	            )

# Things that should be done about this table
# Populate it with all classes that are on the registery
# Create a 'add_class function where someone can add a class to the database' 
db.define_table('classes',
	            Field('title'),
	            Field('class_id'),
	            Field('professor'),
	            Field('department'),
				Field('department_id'),
	            primarykey=['title', 'class_id', 'department']
	            )
locations = ['Academic Resources Center 221 (front desk)',
    'Coastal Biology Building',
    'Crown Library',
    'Kresge Study Center',
    'Learning Support Services/HSI Cowell College Mobile Office - Conference Room', 'Learning Support Services/HSI Cowell College Mobile Office - Lobby',
    'McHenry Library Circulation Desk', 'Merrill Library/Casa Latina',
    'Namaste Lounge, College 10',
    'Oakes Learning Center',
    'Paige Smith Library (Open till 2AM)',
    'Perk Coffee Bar, Earth & Marine Sciences',
    'Perk Coffee Bar, J. Baskin Engineering',
    'Porter College Mailroom',
    'Science & Engineering Library, Front Desk',
    'Stevenson Library',
    'Thimann Labs Second Floor Entrance']

times = ["00:00", "00:15",
               "00:30", "00:45",
               "01:00", "01:15", 
               "01:30", "01:45",
               "02:00", "02:15", 
               "02:30", "02:45",
               "03:00", "03:15", 
               "03:30", "03:45",
               "04:00", "04:15", 
               "04:30", "04:45",
               "05:00", "05:15", 
               "05:30", "05:45",
               "06:00", "06:15", 
               "06:30", "06:45",
               "07:00", "07:15", 
               "07:30", "07:45",
               "08:00", "08:15", 
               "08:30", "08:45",
               "09:00", "09:15", 
               "09:30", "09:45",
               "10:00", "10:15", 
               "10:30", "10:45",
               "11:00", "11:15", 
               "11:30", "11:45",
               "12:00", "12:15", 
               "12:30", "12:45",
               "13:00", "13:15", 
               "13:30", "13:45",
               "14:00", "14:15", 
               "14:30", "14:45",
               "15:00", "15:15", 
               "15:30", "15:45",
               "16:00", "16:15", 
               "16:30", "16:45",
               "17:00", "17:15", 
               "17:30", "17:45",
               "18:00", "18:15", 
               "18:30", "18:45",
               "19:00", "19:15", 
               "19:30", "19:45",
               "20:00", "20:15", 
               "20:30", "20:45",
               "21:00", "21:15", 
               "21:30", "21:45",
               "22:00", "22:15", 
               "22:30", "22:45",
               "23:00", "23:15", 
               "23:30", "23:45"]

db.define_table('post',
				Field('department'),
				Field('created_on', 'datetime', default=request.now),
				Field('classnum', requires=IS_NOT_EMPTY()),
				Field('classname'),
				Field('day_of', 'date', requires=IS_NOT_EMPTY()),
				Field('start_time', requires=IS_IN_SET(times), zero=T('Choose a start time.')),
				Field('end_time', requires=IS_IN_SET(times), zero=T('Choose a finish time.')),
				Field('meeting_location', requires=IS_IN_SET(locations), zero=T('Choose a meeting location.')),
				Field('created_by', 'reference auth_user',  default=auth.user_id),
				Field('capacity', default=1),
				Field('students_joined', 'reference auth_user'),
				Field('num_students_joined', 'integer', default=0),
				Field('leader_email', default=get_user_email()),
				Field('leader_name', default=get_user_name())
			   )

db.post.classname.widget = SQLFORM.widgets.autocomplete(request, db.classes.title, limitby=(0,10), min_length=2)
db.post.created_on.writable = False
db.post.created_on.readable = False


db.define_table('student',
	            Field('name'),
	            Field('email', default=get_user_email()),
	            Field('major'),
	            Field('acadmic_year', 'integer'),
                primarykey=['name', 'email', 'acadmic_year']
	            )

db.student.email.readable = False
db.student.email.writable = False

db.define_table('ownership',
                    Field('post', 'reference post'),
                    Field('student', 'reference auth_user'))


"""
db.define_table('category',Field('name'))
db.define_table('product',Field('name'),Field('category'))
db.product.category.widget = SQLFORM.widgets.autocomplete(
     request, db.category.name, limitby=(0,10), min_length=2)

"""

#db.post.department.requires = IS_IN_DB(db, 'classes.department', "%(department)s", zero=T('choose one'))
				
db.post.created_by.writable = False


# after defining tables, uncomment below to enable auditing
# auth.enable_record_versioning(db)

