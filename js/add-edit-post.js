import postApi from './api/postApi';
import { initPostForm, toast } from './utils';

async function handlePostFormSubmit(formValues) {
  // console.log('sumit form parent', formValues);
  try {
    //check add/edit mode
    //call api
    // let savedPost = null;
    // if (formValues.id) {
    //   await postApi.update(formValues);
    // } else {
    //   await postApi.add(formValues);
    // }
    // throw new Error('Error from testing');
    const savedPost = formValues.id
      ? await postApi.update(formValues)
      : await postApi.add(formValues);
    //show success message
    toast.success('Save post sucessfully! ');
    //redirect to details page
    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${savedPost.id}`);
    }, 2000);

    console.log('id', savedPost.id);
  } catch (error) {
    console.log('failed to save post', error);
    toast.error(`Failed to save post with error: ${error.message} `);
  }
}

(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get('id');
    const defaultValues = postId
      ? await postApi.getById(postId)
      : {
          title: '',
          author: '',
          description: '',
          imageUrl: '',
        };

    initPostForm({
      formId: 'postForm',
      defaultValues,
      onSubmit: handlePostFormSubmit,
    });
  } catch (error) {
    console.log('failed to fetch post details', error);
  }
})();
