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


db.define_table('checklist',
                Field('user_email', default=get_user_email()),
               
                Field('memo', 'text'),
                Field('updated_on', 'datetime', update=datetime.datetime.utcnow()),
                Field('is_public', 'boolean', default=False)
                )

db.checklist.user_email.writable = False
db.checklist.user_email.readable = False
db.checklist.is_public.writable = False
db.checklist.is_public.readable = False
db.checklist.updated_on.writable = db.checklist.updated_on.readable = False
db.checklist.id.writable = db.checklist.id.readable = False


db.define_table('appointments',
	           Field('appointment', 'datetime'),
	           Field('tutor'),
	           Field('can_cancel', 'boolean', default=True),
	           Field('student'),
	           Field('rate', 'double', default=11.00),
	           primarykey=['appointment', 'tutor']
	           )

db.appointments.tutor.writable = False
db.appointments.tutor.readable = False
db.appointments.can_cancel.writable = False
db.appointments.can_cancel.readable = False

# Things that should be done about this table
# Populate it with all classes that are on the registery
# Create a 'add_class function where someone can add a class to the database' 
db.define_table('classes',
	            Field('title'),
	            Field('class_id'),
	            Field('professor'),
	            Field('department'),
	            primarykey=['title', 'class_id', 'department'],
	            )

db.define_table('student',
	            Field('name'),
	            Field('email', default=get_user_email()),
	            Field('major'),
	            Field('acadmic_year', 'integer'),
                primarykey=['name', 'email', 'acadmic_year']
	            )

db.student.email.readable = False
db.student.email.writable = False

db.define_table('tutor',
                Field('name'),
                Field('email'),
                Field('major'),
                Field('academic_year'),
                Field('classes'),
                Field('rating', 'double', default=0.0),
                primarykey=['name', 'email', 'major']
	            )

# after defining tables, uncomment below to enable auditing
# auth.enable_record_versioning(db)
