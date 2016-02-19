/**
  * Node Emulator Project
  *
  * General features configuration
  *
  * @author Alvaro Bezerra <alvaro.dasmerces@gmail.com>
*/

//export
module.exports = {
	features: {
		/**
		  * Use clusters?
		  * Clusters can distribute incoming connections through workers, increasing server overall performance.
		  *
		  * See <https://nodejs.org/api/cluster.html> for details.
		*/
		useClusters: false,

		/**
	      * Number of clusters
		*/
		numberOfClusters: 3
	}
};