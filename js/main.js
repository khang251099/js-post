import axiosClient from './api/axiosClient';
import postApi from './api/postApi';

async function main() {
  try {
    const queryParams = {
      _page: 1,
      _litmit: 5,
    };
    const { data, pagination } = await postApi.getAll(queryParams);
  } catch (error) {
    console.log('get all failed' + error);
  }
}
main();
