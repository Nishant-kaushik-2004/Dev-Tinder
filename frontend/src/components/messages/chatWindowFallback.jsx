const ChatWindowFallback = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-base-100">
      <div className="text-center">
        <div className="text-6xl mb-4">💬</div>
        <h2 className="text-xl font-semibold mb-2">
          Select a chat to start messaging
        </h2>
        <p className="text-base-content/60">
          Choose from your existing conversations or search for new developers
        </p>
      </div>
    </div>
  );
};

export default ChatWindowFallback;
