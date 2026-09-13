export interface PortfolioData {
  portfolio: {
    owner: {
      name: string
      professional_title: string
      tagline: string
      location: string
      email: string
      linkedin_url: string
      github_url: string
      resume_url: string
    }
    navigation: {
      label: string
      path: string
    }[]
    home: {
      hero: {
        name: string
        title: string
        headline: string
        description: string
        primary_cta: {
          label: string
          target: string
        }
        secondary_cta: {
          label: string
          target: string
        }
        tertiary_cta: {
          label: string
          target: string
        }
      }
      metrics: {
        id: string
        label: string
        value: number
        suffix: string
        dynamic?: boolean
        increment_on?: string
        storage?: string
      }[]
      about: {
        title: string
        content: string
      }
      expertise: {
        title: string
        description: string
        skills: string[]
      }[]
      featured_sections: {
        experience: {
          title: string
          description: string
          cta: {
            label: string
            target: string
          }
        }
        publications: {
          title: string
          description: string
          cta: {
            label: string
            target: string
          }
        }
        templates: {
          title: string
          description: string
          cta: {
            label: string
            target: string
          }
        }
      }
    }
    experience: {
      page_title: string
      page_subtitle: string
      roles: {
        id: string
        company: string
        role: string
        location: string
        start_date: string
        end_date: string
        current: boolean
        category: string[]
        summary: string
        metrics: {
          label: string
          value: number
          suffix: string
        }[]
        responsibilities: string[]
      }[]
    }
    publications: {
      page_title: string
      page_subtitle: string
      categories: string[]
      items: {
        id: string
        title: string
        authors: string[]
        publication_type: string
        journal_or_conference: string
        year: string
        abstract: string
        tags: string[]
        doi: string
        external_url: string
        pdf_url: string
        views: number
        downloads: number
        featured: boolean
      }[]
    }
    free_templates: {
      page_title: string
      page_subtitle: string
      templates: {
        id: string
        title: string
        description: string
        category: string
        format: string[]
        includes: string[]
        file_url: string
        download_count: number
        counter_type: string
        increment_on: string
        featured: boolean
      }[]
      aggregate_metrics: {
        total_downloads: number
        dynamic: boolean
        calculation: string
      }
    }
    linkedin: {
      page_title: string
      headline: string
      description: string
      profile_url: string
      cta: {
        label: string
        target: string
      }
      featured_posts: {
        id: string
        category: string
        title: string
        description: string
        url: string
      }[]
    }
    analytics: {
      enabled: boolean
      track: string[]
    }
    design: {
      style: string
      layout: string
      background: string
      secondary_background: string
      text_primary: string
      text_secondary: string
      accent_primary: string
      accent_secondary: string
      border_color: string
      font_family: string
      heading_style: string
      card_style: {
        border_radius: string
        shadow: string
        border: string
      }
    }
    footer: {
      name: string
      description: string
      links: {
        label: string
        target: string
      }[]
      social_links: {
        linkedin: string
        github: string
        email: string
      }
      show_website_visits: boolean
      copyright: string
    }
  }
}
