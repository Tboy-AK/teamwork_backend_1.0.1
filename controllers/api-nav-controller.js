const apiNavController = () => {
  const getViews = async (req, res) => {
    const data = [
      {
        url: '/',
        methods: {
          GET: {
            desc: 'Get API views',
            response: {
              body: 'Object',
            },
          },
        },
      },
      {
        url: '/api/v1.0.1/auth/create-user',
        methods: {
          POST: {
            desc: 'Admin can create an employee user account.',
            response: {
              header: {
                Authorization: 'JWT access token',
              },
              cookie: 'JWT refresh token',
              body: 'Object',
            },
          },
        },
      },
      {
        url: '/api/v1.0.1/auth/signin',
        methods: {
          POST: {
            desc: 'Admin/Employees can sign in.',
            response: {
              header: {
                Authorization: 'JWT access token',
              },
              cookie: 'JWT refresh token',
              body: 'Object',
            },
          },
        },
      },
      {
        url: '/api/v1.0.1/articles',
        header: {
          Authorization: 'JWT access token',
        },
        methods: {
          POST: {
            desc: 'Employees can create an article.',
            response: {
              body: 'Object',
            },
          },
        },
      },
      {
        url: '/api/v1.0.1/articles/:articleId',
        header: {
          Authorization: 'JWT access token',
        },
        methods: {
          PATCH: {
            desc: 'Auth employee can edit an article.',
            response: {
              body: 'Object',
            },
          },
          DELETE: {
            desc: 'Auth employee can delete an article.',
            response: {
              body: 'String',
            },
          },
          GET: {
            desc: 'Employees can view a specific article.',
            response: {
              body: 'Object',
            },
          },
        },
      },
      {
        url: '/api/v1.0.1/articles/comments',
        header: {
          Authorization: 'JWT access token',
        },
        methods: {
          POST: {
            desc: 'Employees can comment on an article.',
            response: {
              body: 'Object',
            },
          },
        },
      },
      {
        url: '/api/v1.0.1/articles/:articleId/comments/:commentId',
        header: {
          Authorization: 'JWT access token',
        },
        methods: {
          PATCH: {
            desc: 'Auth employee can edit a comment on an article.',
            response: {
              body: 'Object',
            },
          },
          DELETE: {
            desc: 'Auth employee can delete a comment on an article.',
            response: {
              body: 'String',
            },
          },
        },
      },
      {
        url: '/api/v1.0.1/feed',
        header: {
          Authorization: 'JWT access token',
        },
        methods: {
          POST: {
            desc: 'Employees can view all articles or gifs, showing the most recently posted articles or gifs first.',
            response: {
              body: 'Array',
            },
          },
        },
      },
    ];
    return res.status(200).json(data);
  };

  return { getViews };
};

module.exports = apiNavController;
