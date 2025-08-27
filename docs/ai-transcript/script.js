document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chat-container');
    const totalTokensElement = document.getElementById('total-tokens');
	
	document.getElementById('loading-msg').remove();

    const transcriptData = transcript.chunkedPrompt.chunks || [];

    // Make sure the transcript data exists
    if (!transcriptData || !Array.isArray(transcriptData)) {
        chatContainer.innerHTML = '<p class="message-footer">Error: Transcript data not found or is not in the correct format.</p>';
        return;
    }

    const totalTokenCount = transcriptData.reduce((sum, message) => {
        return sum + (message.tokenCount || 0);
    }, 0);

    if (totalTokensElement) {
        totalTokensElement.textContent = `Total Token Count: ${totalTokenCount.toLocaleString()}`;
    }

    transcriptData.forEach(message => {
		if(message.isThought)
			return;
		
        // Create the main message container
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', message.role); // e.g., 'message user' or 'message model'

        // Create the avatar
        const avatarElement = document.createElement('div');
        avatarElement.classList.add('avatar');
        avatarElement.textContent = message.role === 'user' ? 'U' : 'AI';

        // Create the content bubble
        const contentElement = document.createElement('div');
        contentElement.classList.add('message-content');

        // Combine all parts into a single text block
        let fullText = message.text || '';

        // Convert the Markdown text to HTML using the 'marked' library
        contentElement.innerHTML = message.role === 'user' ? '<pre>' + marked.parse(fullText) + '</pre>' : marked.parse(fullText);
        if(message.role === 'user' && message.driveDocument) {
            contentElement.innerHTML = `<p>Document Upload</p>`;
        }
        if (message.tokenCount) {
            contentElement.innerHTML += `<p class="message-footer">Tokens: ${message.tokenCount.toLocaleString()}</p>`;
        }

        // Append avatar and content to the message container
        messageElement.appendChild(avatarElement);
        messageElement.appendChild(contentElement);

        // Append the whole message to the chat container
        chatContainer.appendChild(messageElement);
    });
});
