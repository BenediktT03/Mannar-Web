import type { Schema, Struct } from '@strapi/strapi';

export interface SocialSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_social_social_links';
  info: {
    description: 'Social Media Verlinkung';
    displayName: 'Social Link';
  };
  attributes: {
    istSichtbar: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    plattform: Schema.Attribute.Enumeration<
      [
        'facebook',
        'instagram',
        'twitter',
        'linkedin',
        'youtube',
        'whatsapp',
        'email',
      ]
    > &
      Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface WordCloudWort extends Struct.ComponentSchema {
  collectionName: 'components_word_cloud_woerter';
  info: {
    description: 'Einzelnes Wort in der Word Cloud';
    displayName: 'Wort';
  };
  attributes: {
    beschreibung: Schema.Attribute.Text;
    farbe: Schema.Attribute.String & Schema.Attribute.DefaultTo<'inherit'>;
    gewichtung: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 10;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<5>;
    istExternerLink: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    link: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    text: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'social.social-link': SocialSocialLink;
      'word-cloud.wort': WordCloudWort;
    }
  }
}
