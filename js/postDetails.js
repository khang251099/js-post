import postApi from './api/postApi';
import { setTextContent } from './utils';
import dayjs from 'dayjs';

// id="postHeroImage"
// id="postDetailTitle"
// id="postDetailAuthor"
// id="postDetailTimeSpan"
// id="postDetailDescription"
// id="goToEditPageLink"

function renderPostDetail(post) {
  //render title, desc,hero image(image Url), updatedAt, author, edit page link
  if (!post) return;
  setTextContent(document, '#postDetailTitle', post.title);
  setTextContent(document, '#postDetailAuthor', post.author);
  setTextContent(document, '#postDetailDescription', post.description);
  setTextContent(
    document,
    '#postDetailTimeSpan',
    `- ${dayjs(post.updatedAt).format('DD/MM/YYYY HH:mm')}`
  );
  const imageHero = document.getElementById('postHeroImage');

  if (imageHero) {
    imageHero.style.backgroundImage = `url(${post.imageUrl})`;
    imageHero.addEventListener('error', () => {
      imageHero.style.backgroundImage = `url(https://via.placeholder.com/1368x400.png?text=Hero image)`;
    });
  }

  const editPageLink = document.getElementById('goToEditPageLink');
  if (editPageLink) {
    editPageLink.href = `/add-edit-post.html?id=${post.id}`;
  }
}

(async () => {
  try {
    //get post id from url
    const searchParams = new URLSearchParams(window.location.search);
    const postID = searchParams.get(`id`);

    if (!postID) {
      console.log('Post not found');
      return;
    }
    const post = await postApi.getById(postID);

    renderPostDetail(post);
  } catch (error) {
    console.log('failed to fetch post detail', error);
  }
})();
