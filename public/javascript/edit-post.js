// Await api fetch for post `id`
async function editFormHandler(event) {
    event.preventDefault();

    const title = document.querySelector('input[name="post-title"]').value.trim();
    const content = document.querySelector('textarea[name="post-content"]').value;
    const editId = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    
    const response = await fetch(`/api/posts/${editId}`, {
        method: 'PUT',
        body: JSON.stringify({
          title,
          content
        }),
        headers: {
          'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.replace('/dashboard');
    } else {
        alert(response.statusText);
    }
}
  
// add query selector