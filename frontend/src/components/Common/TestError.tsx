const TestError = () => {
  throw new Error("Test error from TestError component");
  return <div>This will never render</div>;
};

export default TestError;