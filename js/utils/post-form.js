import { setFieldValue, setBackgroundImage, setTextContent, randomImageUrl } from './common';

function setFormValue(form, formValues) {
  setFieldValue(form, '[name="title"]', formValues?.title);
  setFieldValue(form, '[name="author"]', formValues?.author);
  setFieldValue(form, '[name="description"]', formValues?.description);
  setFieldValue(form, '[name="imageUrl"]', formValues?.imageUrl);

  setBackgroundImage(document, '#postHeroImage', formValues?.imageUrl);
}

function getFormValues(form) {
  //w1: query each input n to values object
  const formValues = {};

  //   ['title', 'author', 'description', 'imageUrl'].forEach(function (name) {
  //     const field = form.querySelector(`[name="${name}"]`);
  //     if (field) formValues[name] = field.value;
  //   });

  //w2: using formData
  const data = new FormData(form);
  for (const [key, value] of data) {
    formValues[key] = value;
  }
  return formValues;
}

function getTitleError(form) {
  const titleElement = form.querySelector('[name="title"]');

  if (!titleElement) return;

  if (titleElement.validity.valueMissing) {
    return 'please enter title';
  }
  if (titleElement.value.split(' ').filter((x) => !!x && x.length >= 3).length < 2) {
    return 'Please enter your title at least 2 characters';
  }

  return '';
}
function getAuthorError(form) {
  const authorElement = form.querySelector('[name="author"]');

  if (!authorElement) return;

  if (authorElement.validity.valueMissing) {
    return 'please enter author';
  }
  if (authorElement.value.split(' ').filter((x) => !!x && x.length >= 3).length < 2) {
    return 'Please enter author at least 2 characters';
  }

  return '';
}
function getDescriptionError(form) {
  return '';
}

function getImageUrl(form) {
  const imageUrlElement = form.querySelector('[name="imageUrl"]');
  // console.log(imageUrlElement.value);
  if (!imageUrlElement) return;

  if (imageUrlElement.validity.valueMissing) {
    return 'Pls random a valid image Url';
  }

  // if (imageUrlElement.value.split(' ').filter((x) => !!x && x.length >= 3).length < 2) {
  //   return 'Please enter author at least 2 characters';
  // }
  return '';
}

// function setFiledError(form, name, error) {
//   const element = form.querySelector(`[name="${name}"]`);
//   if (element) {
//     element.setCustomValidity(error);
//     setTextContent(element.parentElment, '.invalid-feedback', error);
//   }
// }

// function getPostSchema() {
//   return object().shape({
//     title: string().require('Please enter your title'),
//     author: string()
//       .require('Please enter your author')
//       .test(
//         'at-least-2-words',
//         'Please enter at least 2 words',
//         (value) => value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2
//       ),
//     description: string(),
//   });
// }

async function validatePostForm(form, formValues) {
  //get errors

  const errors = {
    title: getTitleError(form),
    author: getAuthorError(form),
    description: getDescriptionError(form),
    imageUrl: getImageUrl(form),
  };

  //set errors
  for (const key in errors) {
    const element = form.querySelector(`[name="${key}"]`);
    if (element) {
      element.setCustomValidity(errors[key]);
      setTextContent(element.parentElment, '.invalid-feedback', errors[key]);
    }
  }

  // try {
  //   //reset previous errors
  //   ['author', 'title'].forEach((name) => setFieldValue(form, name, ''));

  //   const schema = getPostSchema();
  //   await schema.validate(formValues, { abortEarly: false });
  // } catch (error) {
  //   console.log(error.name);
  //   console.log(error?.inner);

  //   for (const validationError of error?.inner) {
  //     const name = validationError.path;
  //     setFiledError(form, name, validationError.message);
  //   }
  // }

  //add was-validated class to form element

  const isValid = form.checkValidity();
  if (!isValid) form.classList.add('was-validated');
  return isValid;
}

function showLoading(form) {
  const button = form.querySelector('[name="submit"]');
  if (button) {
    button.disable = true;
    button.textContent = 'Saving.....';
  }
}
function hideLoading(form) {
  const button = form.querySelector('[name="submit"]');
  if (button) {
    button.disable = false;
    button.textContent = 'Save';
  }
}

function initRandomImage(form) {
  const randomButton = document.getElementById('postChangeImage');
  if (!randomButton) return;
  let count = 0;
  randomButton.addEventListener('click', function (e) {
    //random ID
    //build URL
    //set image URL + background
    const imageUrl = `https://picsum.photos/id/${randomImageUrl(1000)}/1368/400`;
    window.localStorage.setItem('countClick', ++count);
    setFieldValue(form, '[name="imageUrl"]', imageUrl);
    setBackgroundImage(document, '#postHeroImage', imageUrl);
  });
}
function errorMessage(message) {}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;

  //to get the value inside the form by truyền form
  setFormValue(form, defaultValues);

  //init events
  initRandomImage(form);

  let isSubmitting = false;
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!window.localStorage.getItem('countClick') && window.location.search) {
      // show loi o button random image

      const error = document.getElementById('postChangeImage').nextElementSibling;
      error.classList.add('active');
      return;
    }
    window.localStorage.clear();
    // e.preventDefault();
    //show loading /disable button
    //closure inner function
    showLoading(form);
    //get form values
    if (isSubmitting) {
      console.log('one is submitting');
      return;
    }
    isSubmitting = true;
    const formValues = getFormValues(form);
    formValues.id = defaultValues.id;

    // console.log(formValues);
    //if valid trigger  submit callback
    //otherwise, show validations errors
    const isValid = await validatePostForm(form, formValues);
    if (isValid) await onSubmit?.(formValues);

    //use await to await get api and bla bla in function onSubmit
    //always hidden no matter form is valid or not
    hideLoading(form);
    isSubmitting = false;
  });
}
