
const bunyan = require('bunyan');

class Users {
  constructor (iam) {
    this.iam = iam;
    this.log = bunyan.createLogger({ name: 'users' });
  }

  async listUserAccessKeys (UserName) {
    return this.iam.listAccessKeys( { UserName } ).promise();
  }

  async deleteAccessKeys (UserName) {
    const accessKeys = await this.listUserAccessKeys(UserName);
    const promises = accessKeys.AccessKeyMetadata.map(item => this.iam.deleteAccessKeys({
      AccessKeyId: item.AccessKeyId,
      UserName,
    }).promise());

    return Promise.all(promises);
  }

  async listUsers () {
    const data = await this.iam.listUsers().promise();

    let newUsers = data.Users.map( async(item) => {
      item.AccessKeys = await this.listUserAccessKeys( item.UserName );
    });

    this.log.info({
      newUsers: newUsers
    });

    return newUsers;
  }
}

module.exports = Users;