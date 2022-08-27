import { get as _get } from 'request';

class BaseDownloader {


    constructor(url) {
    this.url = url;
  }

  download(url, callback) {

    throw new Error('Not implemented');
  }
}
