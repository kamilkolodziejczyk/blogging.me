import styled from 'styled-components';
const FormWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #989FCE;
  h1 {
    text-align: center;
     color: #272838;
  }
  .form {
    width: 40%;
    padding: 15px;
    background-color: #5D536B;
   
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
