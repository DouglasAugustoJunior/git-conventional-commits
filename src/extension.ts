import * as vscode from "vscode"

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand("git-conventional-commits.open", async () => {
        const commitTypes = [
            { icon: "🚀", label: "feat", description: "Nova funcionalidade 🚀" },
            { icon: "🐛", label: "fix", description: "Correção de bug 🐛" },
            { icon: "📚", label: "docs", description: "Documentação 📚" },
            { icon: "🎨", label: "style", description: "Ajustes de estilo 🎨" },
            { icon: "🔧", label: "refactor", description: "Refatoração 🔧" },
            { icon: "🧪", label: "test", description: "Testes 🧪" },
            { icon: "🏗️", label: "chore", description: "Tarefas de build ou CI 🏗️" }
        ]

        const commitType = await vscode.window.showQuickPick(commitTypes, {
            placeHolder: "Selecione o tipo do commit"
        })
        if (!commitType) return

        const context = await vscode.window.showInputBox({
            prompt: "Digite o contexto do commit (ex: AAA-123, Cadastro, Usuário, Produto)"
        })
        if (!context) return

        const commitMessage = await vscode.window.showInputBox({
            prompt: "Digite a mensagem do commit"
        })
        if (!commitMessage) return

        const formattedCommit = `${commitType.icon}${commitType.label}(${context}): ${commitMessage}`
        vscode.window.showInformationMessage(`${formattedCommit}`)
        setCommitMessage(formattedCommit)
    })

    context.subscriptions.push(disposable)
}

function setCommitMessage(message: string) {
    const gitExtension = vscode.extensions.getExtension("vscode.git")?.exports
    if (!gitExtension) {
        vscode.window.showErrorMessage("Git extension não encontrada!")
        return
    }

    const git = gitExtension.getAPI(1)
    if (!git.repositories || git.repositories.length === 0) {
        vscode.window.showErrorMessage("Nenhum repositório Git encontrado.")
        return
    }

    git.repositories[0].inputBox.value = message
    vscode.commands.executeCommand("git.view")
    vscode.commands.executeCommand("workbench.view.scm")
}

export function deactivate() { }
