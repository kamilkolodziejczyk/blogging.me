import styled from 'styled-components';
const FormWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h1 {
    text-align: center;
  }
  .form {
    width: 40%;
    padding: 15px;
    border: 1px solid black;
    border-radius: 4px;
    -webkit-box-shadow: 6px 4px 28px -11px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 6px 4px 28px -11px rgba(0, 0, 0, 0.75);
    box-shadow: 6px 4px 28px -11px rgba(0, 0, 0, 0.75);
  }
  .form-button {
    width: 100%;
  }
`;

export default FormWrapper;
