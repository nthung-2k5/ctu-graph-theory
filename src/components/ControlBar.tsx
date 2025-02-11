export default function ControlBar() {
  return (
    <div className="control-bar-container">
      <input
        type="range"
        min="1"
        max="5"
        className="input-range"
        style={{
         width: '80px',
         background: 'linear-gradient(to right, #ffffff 0%, #ffffff 100%)',
         backgroundSize: '80px 3px',
         backgroundPosition: 'center',
         backgroundRepeat: 'no-repeat',
        }}
      />
    </div>
  );
}
