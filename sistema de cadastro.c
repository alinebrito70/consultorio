#include <stdio.h>
#include <string.h>

#define MAX 10

typedef struct Paciente {
    char cpf[12];
    char nome[40];
    char idade[4];
} Paciente;

typedef struct FilaCircular {
    int inicio;
    int fim;
    int quantidade;
    Paciente pacientes[MAX];
} FilaCircular;

void limparEnter(char texto[]) {
    texto[strcspn(texto, "\n")] = '\0';
}

void inicializarFila(FilaCircular *fila) {
    fila->inicio = 0;
    fila->fim = 0;
    fila->quantidade = 0;
}

int filaCheia(FilaCircular *fila) {
    return fila->quantidade == MAX;
}

int filaVazia(FilaCircular *fila) {
    return fila->quantidade == 0;
}

int adicionarPaciente(FilaCircular *fila, Paciente paciente) {
    if (filaCheia(fila)) {
        return 0;
    }

    fila->pacientes[fila->fim] = paciente;

    // Aqui acontece a fila circular:
    // se chegar ao final do vetor, volta para a posição 0
    fila->fim = (fila->fim + 1) % MAX;

    fila->quantidade++;

    return 1;
}

int atenderPaciente(FilaCircular *fila, Paciente *paciente) {
    if (filaVazia(fila)) {
        return 0;
    }

    *paciente = fila->pacientes[fila->inicio];

    // Aqui também acontece a fila circular:
    // o início anda e, se passar do final, volta para 0
    fila->inicio = (fila->inicio + 1) % MAX;

    fila->quantidade--;

    return 1;
}

Paciente proximoPaciente(FilaCircular *fila) {
    return fila->pacientes[fila->inicio];
}

void verificarCPF(FilaCircular *fila, char cpf[]) {
    int posicao = fila->inicio;

    for (int i = 0; i < fila->quantidade; i++) {
        if (strcmp(fila->pacientes[posicao].cpf, cpf) == 0) {
            printf("\nCPF encontrado!\n");
            printf("Nome: %s\n", fila->pacientes[posicao].nome);
            printf("CPF: %s\n", fila->pacientes[posicao].cpf);
            printf("Idade: %s\n", fila->pacientes[posicao].idade);
            printf("Posicao na fila: %d\n", i + 1);
            return;
        }

        posicao = (posicao + 1) % MAX;
    }

    printf("\nCPF nao encontrado na fila.\n");
}

void mostrarFila(FilaCircular *fila) {
    int posicao = fila->inicio;

    if (filaVazia(fila)) {
        printf("\nFila vazia.\n");
        return;
    }

    printf("\n___ Pacientes na fila ___\n");

    for (int i = 0; i < fila->quantidade; i++) {
        printf("%d - %s | CPF: %s | Idade: %s\n",
               i + 1,
               fila->pacientes[posicao].nome,
               fila->pacientes[posicao].cpf,
               fila->pacientes[posicao].idade);

        posicao = (posicao + 1) % MAX;
    }
}

int menu() {
    int op;

    printf("\n========== Sistema de Cadastro para Consultoria ==========\n");
    printf("1 - Adicionar paciente\n");
    printf("2 - Atender paciente\n");
    printf("3 - Verificar proximo paciente\n");
    printf("4 - Verificar paciente pelo CPF\n");
    printf("5 - Mostrar fila\n");
    printf("0 - Sair\n");
    printf("Escolha uma opcao: ");
    scanf("%d", &op);
    getchar();

    return op;
}

int main() {
    FilaCircular consultorio;
    Paciente paciente;
    int op;
    char cpf[12];

    inicializarFila(&consultorio);

    do {
        op = menu();

        switch (op) {
            case 1:
                printf("\n___ Cadastro do Paciente ___\n");

                printf("Nome: ");
                fgets(paciente.nome, sizeof(paciente.nome), stdin);
                limparEnter(paciente.nome);

                printf("CPF: ");
                fgets(paciente.cpf, sizeof(paciente.cpf), stdin);
                limparEnter(paciente.cpf);

                printf("Idade: ");
                fgets(paciente.idade, sizeof(paciente.idade), stdin);
                limparEnter(paciente.idade);

                if (adicionarPaciente(&consultorio, paciente)) {
                    printf("\nPaciente cadastrado com sucesso!\n");
                } else {
                    printf("\nFila cheia. Nao foi possivel cadastrar.\n");
                }

                break;

            case 2:
                if (atenderPaciente(&consultorio, &paciente)) {
                    printf("\nPaciente atendido: %s\n", paciente.nome);
                } else {
                    printf("\nFila vazia. Nenhum paciente para atender.\n");
                }

                break;

            case 3:
                if (!filaVazia(&consultorio)) {
                    paciente = proximoPaciente(&consultorio);
                    printf("\nProximo paciente: %s\n", paciente.nome);
                } else {
                    printf("\nFila vazia.\n");
                }

                break;

            case 4:
                printf("\nDigite o CPF: ");
                fgets(cpf, sizeof(cpf), stdin);
                limparEnter(cpf);

                verificarCPF(&consultorio, cpf);

                break;

            case 5:
                mostrarFila(&consultorio);
                break;

            case 0:
                printf("\nEncerrando o sistema...\n");
                break;

            default:
                printf("\nOpcao invalida.\n");
        }

    } while (op != 0);

    return 0;
}