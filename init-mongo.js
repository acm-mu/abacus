// This script will use the MONGO_INITDB_DATABASE database defined in the `docker-compose.yml`

// Settings
db.createCollection('settings');

db.settings.insert({
  competition_name: "Example Competition",
  start_date: new Date('2020-09-15T08:00:00.000+00:00'),
  end_date: new Date('2020-09-25T08:00:00.000+00:00')
})

// Problems
db.createCollection('problems');

db.problems.insert([
  { id: 'A', name: 'Practice Problem' },
  { id: 'B', name: 'Flight Time', cpu_time_limit: 200 },
  { id: 'C', name: 'Toggle Grid', cpu_time_limit: 200, memory_limit: 500 }
])

// Teams 
db.createCollection('teams');

// Passwords are the usernames backwards.
db.teams.insert( [
  { username: 'team1', password: '7072D15E5489DF54D0AFCE595E8194F8B8F52485F6A264F02F894AB4475DBB6B', name: 'The A Team' },
  { username: 'team2', password: '73FE46370074BBDB0AA3653604057416B19A331A8ADEAF1629EB054D72246E06', name: 'Team 2' },
  { username: 'team3', password: 'F976C559EC38719633CFFC3196C8B57954B3AA21CABE9931AD9FC07848B73A94', name: 'Team 3' }
]);

// Submissions
db.createCollection('submissions');