const updateUser = ({
  city, github_username, bio, email, prof_status_id, company_id, handle, user_name,
}) => (
  `UPDATE user
  SET
    name = '${user_name}', prof_status_id = '${prof_status_id}', current_company_id = '${company_id}',
    city = '${city}', github_username = '${github_username}', bio = '${bio}', email = '${email}', 
  WHERE handle = ${handle}`
);

const updateEducation = ({
  degree, stydy_field, program_description,
  start_date, end_date, establishment_id, id,
}) => (
  `UPDATE education
  SET
    establishment_id = '${establishment_id}', degree = '${degree}', stydy_field = '${stydy_field}',
    program_description = '${program_description}', formCell = '${start_date}', toCell = '${end_date}'
  WHERE id = ${id}`
);

const updateExpirience = ({
  job_title, startedDate, endedDate, work_location, work_descriprion, id,
}) => (
  `UPDATE expirience
  SET
    title = '${job_title}', fromCell = '${startedDate}', toCell = '${endedDate}',
    city = '${work_location}', description = '${work_descriprion}'
  WHERE id = ${id}`
);

module.exports = { updateUser, updateEducation, updateExpirience };
