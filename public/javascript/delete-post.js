// Delete post by `id` and redirects user to dashboard
async function deleteFormHandler(event) {
    event.preventDefault();

    const postId = window.location.toString().split('/') [
        window.location.toString().split('/').length - 1
    ];

    const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        document.location.replace('/dashboard');
    } else {
        alert(response.statusText);
    }

}

document.querySelector('pendingbuttonname').addEventListener('click', deleteFormHandler);