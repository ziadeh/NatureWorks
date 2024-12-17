import type { Schema, Attribute } from '@strapi/strapi';

export interface SharedQuestion extends Schema.Component {
  collectionName: 'components_shared_questions';
  info: {
    displayName: 'question';
    icon: 'landscape';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    choice: Attribute.Component<'shared.question-option', true>;
    question: Attribute.String;
  };
}

export interface SharedQuestionScore extends Schema.Component {
  collectionName: 'components_shared_question_scores';
  info: {
    displayName: 'questionScore';
    icon: 'book';
  };
  attributes: {
    question: Attribute.Relation<
      'shared.question-score',
      'oneToOne',
      'api::question.question'
    >;
    score: Attribute.Integer;
  };
}

export interface SharedQuestionOption extends Schema.Component {
  collectionName: 'components_shared_question_options';
  info: {
    displayName: 'questionOption';
    icon: 'apps';
    description: '';
  };
  attributes: {
    choice: Attribute.String;
    selected: Attribute.Boolean;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'shared.question': SharedQuestion;
      'shared.question-score': SharedQuestionScore;
      'shared.question-option': SharedQuestionOption;
    }
  }
}
