const DEFAULT_SCORE = 0;

export function computeSurveyResponseToScores(form, responses) {
  const sum = (a, b) => a + b;

  const getScoreFieldRadiogroup = (field, response) => {
    const choice = field.choices.find((choice) => choice.value === response);
    const score = choice ? choice.score : DEFAULT_SCORE;
    return score;
  };

  const getScoreFieldCheckbox = (field, response) => {
    const choices = field.choices.filter((choice) => response.includes(choice.value));
    const score = choices.map((choice) => choice.score).reduce(sum, 0);
    return score;
  };

  const getScoreField = (field, responses) => {
    let score = DEFAULT_SCORE;
    const response = responses[field.name];
    if (field.type === 'radiogroup') {
      score = getScoreFieldRadiogroup(field, response);
    } else if (field.type === 'checkbox') {
      score = getScoreFieldCheckbox(field, response);
    }
    return score;
  };

  const getScorePage = (page, responses) => {
    const score = page.elements.map((field) => getScoreField(field, responses)).reduce(sum, 0);
    return score;
  };

  const buildPageScoreObject = (name, score) => ({ name, score });
  const pagesToCompute = form.pages.filter((page) => page.elements.some((el) => el.choices));
  const pageScores = pagesToCompute.map((page) =>
    buildPageScoreObject(page.name, getScorePage(page, responses))
  );

  return pageScores;
}
