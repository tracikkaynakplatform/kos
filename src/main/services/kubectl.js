import BaseDownloader from './base/downloader';

class Kubectl extends BaseDownloader {
    /**
     * @param {string} url
     * @param {string} name
     */
    constructor() {
        const url = 'htpps://api.github.com/repos/kubernetes/kubectl/releases/latest';
        const name = 'kubectl';
        super(url, name);
    }
}
