/**
  * Node Emulator Project
  *
  * General features configuration
  *
  * @author Alvaro Bezerra <https://github.com/alvarodms>
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
		numberOfClusters: 3,
		
		/**
		 * Enable account registration via _M/_F?
		*/ 
		enableMFRegistration: false,
		
		log: {
			/**
			 * Enable logging?
			 * Note that this is not recommended at production, as it may affect server performance
			*/ 
			enableLogging: true,
			
			/**
			 * Defines the type os messages to log
			 * 
			 * 1: INFO messages only
			 * 2: WARNING messages only
			 * 3: ERROR messages only
			 * 0: ALL messages
			*/ 
			logLevel: 0,
		}
	}
};