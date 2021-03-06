const getUser = id => (
  `SELECT user.city, user.github_username, user.bio, user.email, user.name as "user_name", user.avatar,
    profession, company.name as "company_name", company.website as "company_site",
    company.id as "company_id", user.handle
  FROM user
    JOIN company
      ON company.id = user.current_company_id
    WHERE user.handle = '${id}';`
);

const getExperience = id => (
  `SELECT 
    expirience.title as "job_title", expirience.fromCell as "startedDate",
    expirience.toCell as "endedDate", expirience.city as "work_location",
    expirience.description as "work_descriprion", company.name as "company_name",
    company.website as "company_website", expirience.id, expirience.company_id as "company_id"
  FROM user
    JOIN expirience
      ON expirience.user_id = user.handle
    JOIN company
      ON company.id = expirience.company_id
  WHERE user.handle = '${id}';`
);

const getEducation = id => (
  `SELECT education.degree, education.stydy_field, education.program_description,
    education.formCell as "start_date", education.toCell as "end_date",
    educational_establishment.name as "establishment",
    educational_establishment.id as "establishment_id",
    education.id
  FROM user
    JOIN education
      ON education.user_id = user.handle
    JOIN educational_establishment
      ON education.establishment_id = educational_establishment.id
  WHERE user.handle = '${id}';`
);

const getSocial = id => (
  `SELECT
    social_network.name as "social_account", social_network.icon,
    social_network.url as "socialUrl", users_social.url as "handle",
    social_network.id
  FROM user
    JOIN users_social
      ON users_social.user_id = user.handle
    JOIN social_network
      ON social_network.id = users_social.social_id
  WHERE user.handle = "${id}";`
);

const getSkills = id => (
  `SELECT
  skills.name as "skill", skills.id
  FROM user
    JOIN skillset
      ON skillset.user_id = user.handle
    JOIN skills
      ON skills.id = skillset.skill_id
  WHERE user.handle = "${id}";`
);


module.exports = { getUser, getExperience, getEducation, getSocial, getSkills };
