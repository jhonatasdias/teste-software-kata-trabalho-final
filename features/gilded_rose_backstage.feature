# ==========================================================
# Backstage passes
# ==========================================================
Feature: Atualização diária dos ingressos Backstage
  Para refletir o valor variável dos ingressos de show
  Como responsável pelo estoque de Backstage passes
  Quero que a qualidade aumente conforme o show se aproxima e zere após o evento

  Scenario: Backstage com mais de 11 dias para o show aumenta 1 ponto
    Given existe um ingresso Backstage no estoque para um show em 15 dias
      And a qualidade do ingresso é 20
    When o sistema atualiza o estoque ao final do dia
    Then o prazo para o show deve passar a ser 14 dias
      And a qualidade do ingresso deve passar a ser 21

  Scenario: Backstage com 11 dias para o show ainda aumenta apenas 1 ponto
    Given existe um ingresso Backstage no estoque para um show em 11 dias
      And a qualidade do ingresso é 20
    When o sistema atualiza o estoque ao final do dia
    Then o prazo para o show deve passar a ser 10 dias
      And a qualidade do ingresso deve passar a ser 21

  Scenario: Backstage com exatamente 10 dias para o show aumenta 2 pontos
    Given existe um ingresso Backstage no estoque para um show em 10 dias
      And a qualidade do ingresso é 20
    When o sistema atualiza o estoque ao final do dia
    Then o prazo para o show deve passar a ser 9 dias
      And a qualidade do ingresso deve passar a ser 22

  Scenario: Backstage com 6 dias para o show aumenta 2 pontos
    Given existe um ingresso Backstage no estoque para um show em 6 dias
      And a qualidade do ingresso é 20
    When o sistema atualiza o estoque ao final do dia
    Then o prazo para o show deve passar a ser 5 dias
      And a qualidade do ingresso deve passar a ser 22

  Scenario: Backstage com exatamente 5 dias para o show aumenta 3 pontos
    Given existe um ingresso Backstage no estoque para um show em 5 dias
      And a qualidade do ingresso é 20
    When o sistema atualiza o estoque ao final do dia
    Then o prazo para o show deve passar a ser 4 dias
      And a qualidade do ingresso deve passar a ser 23

  Scenario: Backstage com 1 dia para o show aumenta 3 pontos
    Given existe um ingresso Backstage no estoque para um show em 1 dia
      And a qualidade do ingresso é 20
    When o sistema atualiza o estoque ao final do dia
    Then o prazo para o show deve passar a ser 0 dias
      And a qualidade do ingresso deve passar a ser 23

  Scenario: Backstage perto do show não ultrapassa qualidade máxima
    Given existe um ingresso Backstage no estoque para um show em 5 dias
      And a qualidade do ingresso é 49
    When o sistema atualiza o estoque ao final do dia
    Then o prazo para o show deve passar a ser 4 dias
      And a qualidade do ingresso deve passar a ser 50

  Scenario: Backstage no dia do show perde todo o valor
    Given existe um ingresso Backstage no estoque para um show em 0 dias
      And a qualidade do ingresso é 20
    When o sistema atualiza o estoque ao final do dia
    Then o prazo para o show deve passar a ser -1 dias
      And a qualidade do ingresso deve passar a ser 0

  Scenario: Backstage após o show permanece sem valor
    Given existe um ingresso Backstage no estoque para um show que já passou há 1 dia
      And a qualidade do ingresso é 20
    When o sistema atualiza o estoque ao final do dia
    Then o prazo para o show deve passar a ser -2 dias
      And a qualidade do ingresso deve ser 0

