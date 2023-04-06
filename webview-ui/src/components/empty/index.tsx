import i18n from '@/i18n';
import styled from 'styled-components';

const Empty = ({ emptyMessage = i18n('webview.common.no_data') }) => {
  return (
    <Wrapper>
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAABPCAMAAAAXxfH1AAAAjVBMVEUAAAC/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7++vr6/v7+/v7+/v7++vr6/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7/9y992AAAALnRSTlMABWchDPbnfMo6X8LyN7Yoo47P+e5AulVsLQnXr1oVG+qcgTOndUndvpVPx4fRwGtpZgAABClJREFUaN7t2dmSojAAheGwBFBRlIDsiCDgNuf9H29w6UrLMgViMxcz3x1dsX6BxDRKGoS1kpG/QWZwyV9R4kwm50dz0cLeET0yrSue9JhMSlSsBNAVupLJtHY7Q4ErSwKpiR1104969t9KCwoi0nD+hf4us7eWk4U5qXMxCHtrXcxPjYllo7JY97I/ArB25BOEFZAUpK+IAqePhCUdgz7NVCAQXqZsHobpGxchAyyJ9OcByvdMVqJSLoevMSAY+EYTiR/GCrDdAsmuf9FRU1XNT4CV5uqfuBnhloDyLayCuYREwKZv103QGz3susJbhKRygNmzu8EggdQRPmJPKif86tcVAeirfsJfADShPbyBbld/tLDut0OWgLkUiNAHkVMAUXvYA/Tr1QL6fZLaAB2yK4fAoT1M5rgTSY0g8XnxMnoh9M7y8TzM2euyPBSNuWvqVmi33eLtkHAEaHItzMnN/X2PG1Y0w19nEItqXW40z7gW7nOF5moCXeoMh2gK4rFhDYtquE2hdoZNtNiNDdPHtr/FujOchcftq+NKHH2pFVxvEzvAqTXcaXR4Der48QZwJg57tAoEwFGYOEyKBJVVTKYOEynfnxxCusOC44rt3EgeEeY6wht028o/GDbRTY9/MDxbBWa7QIt+7FLf+UI7n5AfDXf7H/5wuIicL3N7wvCVgWP1fWmydXyYLmwfTe3Lr9CY8B4LMvdvzGrO/xthLz9cgsXBlcaGhTAdEPbWeNI30sgwFv3DIgWnOCPCxnWN8uT2DKeoaKlzFvcKKuL74Qg3Sb/w/Db0GYtVHUDxdljwIqbNjF5hiQIBH7pUAGXEI4xcu8dZJHSE9wDNCFcwQB0xudxz7bExbg/vKJDWhqKUP7SOfTnEUm4Ni0DymskYUHwm7GuosKgtfELjie4CqB864+tWwXE1awuvgJxw/L2MCnNryO33eNFctylw+FhYDTrCYfO6boDTx8KC3/0IE9bGLoD853cnB9B35DuPAbPusPehcJwA+/qXaabQHS4ARR4X5luEU/tpZE6a4eNzaV741BsXjkuAOi/dkLSETfsmWgBIZ/ZdsRsTJjYDsPduh/4yRGXdFgajjFHcUMoelGJMmEQUADturicND6EY+bVwu8OoMFma4FYr3FyMWpgpiVVDA3to2H39JkjOA9wx0yXkUQ6k2j02pDojfuceb1/3kULdH/apLfCf/Mz45V+aBfkEBwj8P1yO+jnnj+U0XqwAOemyrZd3JaAOK/ieZ9x5nvztWFoBSD2jlXTW8WBm9z+cNYDN/SFd6cKofkfZxePHiY4Ks/RWpY4vtxHPsRdj2Ozlcn78hmEX29AYo3eMmV51bFbHffBzpjp//QCyPXuy/edxL9lZwcMh46+fRJbgTiNTs3XcBAKZ2vJ+zmcyPSO0TIe84Tfmtw84DtxGwwAAAABJRU5ErkJggg==" />
      <p>{emptyMessage}</p>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100%;
  min-height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #888;
`;

export default Empty;
