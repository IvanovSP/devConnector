const updateUser = ({
  city, github_username, bio, email, prof_status_id, company_id, handle, user_name,
}) => (
  `UPDATE user
  SET
    name = '${user_name}', prof_status_id = '${prof_status_id}', current_company_id = '${company_id}',
    city = '${city}', github_username = '${github_username}', bio = '${bio}', email = '${email}', 
  WHERE handle = ${handle}`
);

module.exports = { updateUser };
