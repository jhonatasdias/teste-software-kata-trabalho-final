# ==========================================================
# Itens "Conjurados" (comportamento atual = item comum)
# ==========================================================
Feature: Atualização diária de itens conjurados (comportamento atual)
  Para entender o comportamento atual do sistema
  Como responsável pelo estoque de itens "Conjurados"
  Quero saber como eles são tratados na atualização diária

  Scenario: Item conjurado é tratado como item comum antes do vencimento
    Given existe um item "Conjurado" no estoque com prazo para venda em 5 dias
      And a qualidade do produto é 10
    When o sistema atualiza o estoque ao final do dia
    Then o prazo para venda deve passar a ser 4 dias
      And a qualidade do produto deve passar a ser 9

  # Observação de negócio:
  # No sistema atual, itens "Conjurados" não degradam mais rápido.
  # Eles seguem exatamente as mesmas regras de um item comum.
