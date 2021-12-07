import { setTextContent, truncateText } from './common';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

//to use from Now
dayjs.extend(relativeTime);

export function createPostElement(post) {
  // console.log({ post });
  if (!post) return;

  const postTemplate = document.getElementById('postTemplate');
  if (!postTemplate) return;

  const liElement = postTemplate.content.firstElementChild.cloneNode(true);
  if (!liElement) return;

  setTextContent(liElement, '[data-id="title"]', post.title);
  setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 100));
  setTextContent(liElement, '[data-id="author"]', post.author);
  setTextContent(liElement, '[data-id="timeSpan"]', `- ${dayjs(post.updateAt).fromNow()}`);

  const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]');
  if (thumbnailElement) {
    thumbnailElement.src = post.imageUrl;

    thumbnailElement.addEventListener('error', () => {
      thumbnailElement.src = `https://via.placeholder.com/350x200.png?text=thumbnail`;
    });
  }
  //attach events
  const postItem = liElement.firstElementChild;
  if (!postItem) return;
  postItem.addEventListener('click', (e) => {
    const menu = liElement.querySelector('[data-id="menu"]');

    if (menu && menu.contains(e.target)) return;

    window.location.assign(`/post-detail.html?id=${post.id}`);
  });
  const editButton = liElement.querySelector('[data-id="edit"]');

  if (!editButton) return;

  editButton.addEventListener('click', (e) => {
    //Case 1
    //prevent event bubbling to parent
    // e.stopPropagation();
    window.location.assign(`/add-edit-post.html?id=${post.id}`);
  });

  const removeButton = liElement.querySelector('[data-id="remove"]');
  if (!removeButton) return;
  removeButton.addEventListener('click', (e) => {
    e.preventDefault();

    const customEvent = new CustomEvent('post-delete', {
      bubbles: true,
      detail: post,
    });
    removeButton.dispatchEvent(customEvent);
  });

  // const modal = document.getElementById('deleteModal');
  // console.log(modal);
  // const button
  return liElement;
}

export function renderPostList(postList) {
  if (!Array.isArray(postList)) return;
  const ulElement = document.getElementById('postList');
  if (!ulElement) return;

  //clear current list
  ulElement.textContent = '';

  postList.forEach((post, index) => {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  });
}
