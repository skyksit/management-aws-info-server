
const bunyan = require('bunyan');
const delay = 3000;

class Users {
  constructor (iam) {
    this.iam = iam;
    this.log = bunyan.createLogger({ name: 'users' });
  };

  getUserAccessKeys (username, marker=null) {
    return new Promise((resolve, reject) => {
      this.iam.listAccessKeys( { UserName: username, Marker: marker }, (err, data) => {
        if (err) reject(err);
        if (data.IsTruncated) {
          return wait(delay)
            .then(() => this.getUserAccessKeys(username, data.Marker))
            .then(keys => {
              resolve(data.AccessKeyMetadata.concat(keys));
            });
        }
        resolve(data.AccessKeyMetadata);
      });
    });
  };

  wait (delay) {
    return new Promise((resolve, reject) => {
      console.log(`delaying ${delay} milliseconds...`);
      setTimeout(resolve, delay);
    });
  };

  async listIAMUsers (marker=null, path='/') {
    return new Promise((resolve, reject) => {
      this.iam.listUsers({ Marker: marker, PathPrefix: path }, (err, data) => {
        if (err) reject(err);
        // console.log(`data...........${JSON.stringify(data)}`);

        if (data.Users.IsTruncated) {
          return wait(delay)
            .then(() => this.listIAMUsers(data.Marker, path))
            .then(users => {
              resolve(data.Users.concat(users));
            });
        }
        resolve(data.Users);
      });
    });
  };

  async listUsers () {
    let arr = await this.listIAMUsers();
    const listUsersResult = (await Promise.all(
      arr.map( user => {
        return this.getUserAccessKeys(user.UserName);
      })
    )).reduce((result, message, index) => {
      let userResult = arr[index];
      userResult.AccessKeyMetadata = message;
      result.push(userResult);
      return result;
    }, []);
    return listUsersResult;
  }
}

module.exports = Users;