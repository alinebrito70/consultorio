🏥 Sistema de Cadastro para Consultoria com Fila Circular

Este projeto foi desenvolvido com o objetivo de demonstrar, de forma prática e visual, a aplicação da estrutura de dados Fila Circular, utilizando a linguagem C e uma interface complementar em HTML, CSS e JavaScript.

O sistema simula o atendimento de pacientes em um consultório, onde cada paciente entra no final da fila e o atendimento acontece sempre para o primeiro da fila, seguindo a lógica FIFO (First In, First Out) — ou seja, o primeiro que entra é o primeiro a ser atendido.

📌 Sobre o Projeto

A proposta principal foi transformar um conceito teórico de Estrutura de Dados em uma aplicação mais intuitiva e próxima da realidade.

Por isso, foi escolhido um sistema de cadastro para consultoria, onde é possível visualizar claramente o funcionamento da fila circular no processo de atendimento dos pacientes.

Além da versão em terminal desenvolvida em C, também foi criada uma interface visual para facilitar a apresentação e a compreensão da lógica da fila.

⚙️ Funcionalidades

✔ Adicionar paciente na fila
✔ Chamar paciente para consulta
✔ Verificar o próximo paciente
✔ Buscar paciente pelo CPF
✔ Mostrar fila de espera
✔ Visualização gráfica da fila circular
✔ Controle de início, fim e quantidade da fila

🔄 Como funciona a Fila Circular

A fila circular utiliza um vetor de tamanho fixo e trabalha com três variáveis principais:

Início → indica o primeiro paciente da fila
Fim → indica a próxima posição disponível
Quantidade → controla quantos pacientes estão na fila

Quando o índice chega ao final do vetor, ele retorna automaticamente para a posição inicial utilizando o operador módulo:

(indice + 1) % MAX

Isso permite o reaproveitamento das posições já liberadas, tornando a estrutura mais eficiente e evitando desperdício de espaço.

💻 Tecnologias Utilizadas
Linguagem C
HTML
CSS
JavaScript
Visual Studio Code
GCC (MinGW)
🎯 Objetivo Acadêmico

Este projeto foi desenvolvido como atividade da disciplina de Estrutura de Dados, com foco no estudo, compreensão e aplicação prática da estrutura Fila Circular.

A ideia foi unir teoria e prática em uma solução simples, funcional e visualmente didática.

👨‍💻 Autores

Aline Brito
Derik Alexandre

🚀 Projeto acadêmico desenvolvido para fins de aprendizado
