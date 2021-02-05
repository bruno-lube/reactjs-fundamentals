import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    console.log(uploadedFiles);
    if (uploadedFiles.length <= 0) return;

    try {
      uploadedFiles.forEach(file => {
        const data = new FormData();
        data.set('file', file.file, file.name);
        api.post('/transactions/import', data).then(response => console.log(response.data))
      });

      setUploadedFiles([]);
    } catch (err) {
      console.log(err.response.error);
    }
  }

  function submitFile(files: File[]): void {
    if (files.length > 0) {
      const submittedFiles: FileProps[] = [];

      files.forEach(file => {
        if (uploadedFiles.some(uploaded => uploaded.name === file.name)) return;
        
        submittedFiles.push({
          file: file,
          name: file.name,
          readableSize: filesize(file.size, {fullform: true, round: 1, separator: ','})
        })
      });

      setUploadedFiles([...uploadedFiles, ...submittedFiles]);
    }
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
