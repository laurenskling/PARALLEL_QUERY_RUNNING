exports.createResolvers = ({ createResolvers }) => {
  createResolvers({
    SWAPI_Film: {
      title: {
        resolve(source) {
          return `The title is: ${source.title}`;
        },
      },
    },
  });
};


exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  const activity = reporter.activityTimer('creating film pages');
  activity.start();

  const result = await graphql(`
    query MyQuery {
      swapi {
        allFilms {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  `);
  // Handle errors
  if (result.errors) {
    console.error(result.errors);
    return;
  }

  const { allFilms } = result.data.swapi;

  const filmTemplate = require.resolve('./src/templates/film.js');

  allFilms.edges.forEach(({ node }) => {
    createPage({
      path: node.id,
      component: filmTemplate,
      context: {
        id: node.id,
      }, // additional data can be passed via context
      defer: true,
    });
  });

  activity.setStatus(`Created ${allFilms.edges.length} film pages`);
  activity.end();
};
